import { Routes } from '@angular/router';
import { CxLoginComponent } from './login/login.component';
import { CxRegisterComponent } from './register/register.component';

export default [
  {
    path: 'login',
    component: CxLoginComponent,
  },
  {
    path: 'register',
    component: CxRegisterComponent,
  },
] as Routes;
