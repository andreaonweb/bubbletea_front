import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CustomValidators } from '../../../shared/validators/custom.validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showPassword = signal(false);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), CustomValidators.strongPassword()]],
    confirm: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  private passwordMatchValidator(group: any) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirm')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.value;
    this.authService.register(email!, password!).subscribe({
      error: err => {
        this.errorMessage.set(this.getFirebaseError(err.code));
        this.isLoading.set(false);
      }
    });
  }

  private getFirebaseError(code: string): string {
    const errors: Record<string, string> = {
      'auth/email-already-in-use': 'Este email ya está registrado',
      'auth/weak-password': 'La contraseña es demasiado débil',
      'auth/invalid-email': 'Email no válido'
    };
    return errors[code] ?? 'Error al registrarse';
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }
}