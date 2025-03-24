import { Routes } from '@angular/router';
import { CxAboutComponent } from '@pages/about/about.component';
import { CxNotFoundComponent } from '@pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: 'overview',
    loadChildren: () => import('./pages/overview/overview.routes'),
  },
  { path: 'about', component: CxAboutComponent },
  { path: '404', component: CxNotFoundComponent },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
  },
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: '**', pathMatch: 'full', redirectTo: '/404' },
];
