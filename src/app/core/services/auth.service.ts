import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged, User as FirebaseUser
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { AuthUser } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  private readonly _currentUser = signal<AuthUser | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());

  constructor() {
    onAuthStateChanged(this.auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        this._currentUser.set({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName
        });
      } else {
        this._currentUser.set(null);
      }
    });
  }

  login(email: string, password: string): Observable<void> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password)
        .then(() => { this.router.navigate(['/bubbleteas']); })
    );
  }

  register(email: string, password: string): Observable<void> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
        .then(() => { this.router.navigate(['/bubbleteas']); })
    );
  }

  logout(): Observable<void> {
    return from(
      signOut(this.auth)
        .then(() => { this.router.navigate(['/auth/login']); })
    );
  }
}