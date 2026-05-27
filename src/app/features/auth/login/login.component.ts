import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showPassword = signal(false);

  readonly form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.value;
    this.authService.login(email!, password!).subscribe({
      error: err => {
        this.errorMessage.set(this.getFirebaseError(err.code));
        this.isLoading.set(false);
      }
    });
  }

  private getFirebaseError(code: string): string {
    const errors: Record<string, string> = {
      'auth/user-not-found':  'Usuario no encontrado',
      'auth/wrong-password':  'Contraseña incorrecta',
      'auth/too-many-requests': 'Demasiados intentos. Espera un momento'
    };
    return errors[code] ?? 'Error de autenticación';
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }
}