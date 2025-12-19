import { inject, Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '@srv/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  #authService = inject(AuthService);
  canActivate() {
    const rlt = this.#authService.me;
    if (!rlt) {
      window.location.href = '/auth/login';
    }
    return !!rlt;
  }
}
