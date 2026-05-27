import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { BubbleTeaService } from '../../../core/services/bubbletea.service';
import { BubbleTea } from '../../../shared/models/bubbletea.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-bubbletea-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, LoadingSpinnerComponent],
  templateUrl: './bubbletea-detail.component.html',
  styleUrls: ['./bubbletea-detail.component.scss']
})
export class BubbleTeaDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly bubbleTeaService = inject(BubbleTeaService);

  readonly isLoading = signal(false);
  readonly tea = signal<BubbleTea | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading.set(true);
      this.bubbleTeaService.getById(+id).subscribe({
        next: tea => { this.tea.set(tea); this.isLoading.set(false); },
        error: () => this.isLoading.set(false)
      });
    }
  }
}