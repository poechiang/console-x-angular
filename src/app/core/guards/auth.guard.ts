import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@srv/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanDeactivate<any> {
  canDeactivate(
    component: any,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
  ): MaybeAsync<GuardResult> {
    this.#authService.needHeartbeat = false;
    return true;
  }
  #authService = inject(AuthService);
  async canActivate() {
    const me = this.#authService.me;
    if (!me) {
      window.location.href = '/auth/login';
    }

    this.#authService.needHeartbeat = true;

    await this.#authService.heartbeat();
    return !!me;
  }
}
