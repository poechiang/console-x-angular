import { Routes } from '@angular/router';
import { CxAboutComponent } from '@pages/about/about.component';
import { CxPagesComponent } from './pages.component';

export default [
  {
    path: '',
    component: CxPagesComponent,
    children: [
      {
        path: 'overview',
        loadChildren: () => import('./overview/overview.routes'),
      },
    ],
  },
  {
    path: 'profiles',
    loadChildren: () => import('./profiles/profiles.routes'),
  },
  { path: 'about', component: CxAboutComponent },
] as Routes;
