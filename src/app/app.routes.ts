import { Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { CxNotFoundComponent } from '@pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    canDeactivate: [AuthGuard],
    loadChildren: () => import('./pages/pages.routes'),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
  },
  { path: '404', component: CxNotFoundComponent },
  { path: '**', redirectTo: '/404' },
];
