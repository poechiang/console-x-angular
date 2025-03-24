import { Routes } from '@angular/router';
import { CxDashboardComponent } from './dashboard/dashboard.component';
import { overviewResolver } from './overview.resolver';

export default [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: CxDashboardComponent,
    resolve: { data: overviewResolver },
  },
] as Routes;
