import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/bubbleteas', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'bubbleteas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/bubbletea/bubbletea-list/bubbletea-list.component')
        .then(m => m.BubbleTeaListComponent)
  },
  {
    path: 'bubbleteas/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/bubbletea/bubbletea-form/bubbletea-form.component')
        .then(m => m.BubbleTeaFormComponent)
  },
  {
    path: 'bubbleteas/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/bubbletea/bubbletea-form/bubbletea-form.component')
        .then(m => m.BubbleTeaFormComponent)
  },
  {
    path: 'bubbleteas/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/bubbletea/bubbletea-detail/bubbletea-detail.component')
        .then(m => m.BubbleTeaDetailComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/users/user-profile/user-profile.component')
        .then(m => m.UserProfileComponent)
  },
  { path: '**', redirectTo: '/bubbleteas' }
];