import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BubbleTeaService } from '../../../core/services/bubbletea.service';
import { BubbleTea, BubbleTeaFilter, Temperature } from '../../../shared/models/bubbletea.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-bubbletea-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, LoadingSpinnerComponent],
  templateUrl: './bubbletea-list.component.html',
  styleUrls: ['./bubbletea-list.component.scss']
})
export class BubbleTeaListComponent implements OnInit {
  private readonly bubbleTeaService = inject(BubbleTeaService);

  readonly isLoading = signal(false);
  readonly teas = signal<BubbleTea[]>([]);
  readonly filter = signal<BubbleTeaFilter>({ temperature: '', activeOnly: false, search: '' });

  readonly filtered = computed(() => {
    const { temperature, activeOnly, search } = this.filter();
    return this.teas().filter(t => {
      if (activeOnly && !t.active) return false;
      if (temperature && t.temperature !== temperature) return false;
      if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  });

  ngOnInit(): void {
    this.isLoading.set(true);
    this.bubbleTeaService.getAll().subscribe({
      next: teas => { this.teas.set(teas); this.isLoading.set(false); },
      error: () => this.isLoading.set(false)
    });
  }

  setFilter(partial: Partial<BubbleTeaFilter>): void {
    this.filter.update(f => ({ ...f, ...partial }));
  }

  delete(id: number): void {
    if (!confirm('¿Desactivar este BubbleTea?')) return;
    this.bubbleTeaService.delete(id).subscribe({
      next: () => this.teas.update(list => list.filter(t => t.id !== id))
    });
  }
}