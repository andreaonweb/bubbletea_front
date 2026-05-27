import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  private readonly fb = inject(FormBuilder);
  readonly authService = inject(AuthService);

  readonly isLoading = signal(false);
  readonly successMessage = signal<string | null>(null);

  readonly form = this.fb.group({
    email: [{ value: this.authService.currentUser()?.email ?? '', disabled: true }],
    displayName: [this.authService.currentUser()?.displayName ?? '', Validators.maxLength(100)]
  });

  onLogout(): void {
    this.authService.logout().subscribe();
  }
}