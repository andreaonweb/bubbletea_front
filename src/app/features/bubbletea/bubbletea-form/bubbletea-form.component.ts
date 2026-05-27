import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BubbleTeaService } from '../../../core/services/bubbletea.service';
import { CustomValidators } from '../../../shared/validators/custom.validators';
import { Temperature } from '../../../shared/models/bubbletea.model';

@Component({
  selector: 'app-bubbletea-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bubbletea-form.component.html',
  styleUrls: ['./bubbletea-form.component.scss']
})
export class BubbleTeaFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly bubbleTeaService = inject(BubbleTeaService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Signals de estado (SOLID: SRP - solo estado de UI)
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly editId = signal<number | null>(null);
  readonly isEditMode = computed(() => !!this.editId());

  readonly temperatures: Temperature[] = ['cold', 'hot', 'both'];

  readonly form: FormGroup = this.fb.group({
    name:        ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    temperature: ['cold', Validators.required],
    price:       ['', [Validators.required, CustomValidators.positiveNumber(), CustomValidators.maxDecimals(2)]],
    active:      [true]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId.set(+id);
      this.loadBubbleTea(+id);
    }
  }

  private loadBubbleTea(id: number): void {
    this.isLoading.set(true);
    this.bubbleTeaService.getById(id).subscribe({
      next: tea => {
        this.form.patchValue(tea);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error cargando el registro.');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formValue = this.form.value;
    const action$ = this.isEditMode()
      ? this.bubbleTeaService.update(this.editId()!, formValue)
      : this.bubbleTeaService.create(formValue);

    action$.subscribe({
      next: () => this.router.navigate(['/bubbleteas']),
      error: err => {
        this.errorMessage.set('Error al guardar. Inténtalo de nuevo.');
        this.isLoading.set(false);
      }
    });
  }

  // Helper para errores en template (DRY)
  hasError(field: string, errorType: string): boolean {
    const control = this.form.get(field);
    return !!control?.hasError(errorType) && (control.dirty || control.touched);
  }

  onCancel(): void {
    this.router.navigate(['/bubbleteas']);
  }
}