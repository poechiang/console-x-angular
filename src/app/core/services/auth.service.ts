import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { debounce } from '@lib/utils/debounce';
import { BehaviorSubject } from 'rxjs';
import { Storage } from 'src/app/libs/Storage.class';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #https = inject(HttpsService);
  #router = inject(Router);

  constructor() {
    window.addEventListener('keypress', this.userEventHandler);
    window.addEventListener('click', this.userEventHandler);
    window.addEventListener('wheel', this.userEventHandler);
    this.#https.onNextworkFeedback.subscribe(resp => {
      if (resp.status === 401 && this.isLogined) {
        this.afterLogout();
      }
    });
  }

  #isLogined = Storage.session<boolean>('isLogined') ?? false;
  get isLogined(): boolean {
    return this.#isLogined;
  }
  set isLogined(value: boolean) {
    if (this.#isLogined !== value) {
      this.#isLogined = value;
      Storage.session('isLogined', value);
    }
  }

  userEventHandler = debounce(
    async () => {
      if (!this.isLogined) {
        return;
      }

      try {
        const payload = await this.#https.get('/auth/heartbeat');

        if (payload?.renewed) {
          Storage.session('token', payload.token, 1200000);
        }
      } catch (err) {
        console.log('heartbeat error', err);
        return;
      }
    },
    { wait: 500 },
  );

  #me: User | null = Storage.local('me');
  meChange = new BehaviorSubject<User | null>(this.me);
  get me(): User | null {
    return this.#me;
  }

  private set me(value: User) {
    this.#me = value;
    Storage.local('me', value, 1200000);
    this.meChange.next(value);
  }

  async login(params: { userName: string; password: string }) {
    const token = await this.#https.post('/auth/token', params);
    if (token) {
      Storage.session('token', token, 1200000);
      this.me = await this.#https.get('/users/me', null, { feedbackOnError: false });
      if (this.me) {
        this.isLogined = true;
      }
    }
    return !!token;
  }

  async logout() {
    await this.#https.post('/auth/logout');
    this.afterLogout();
  }

  private afterLogout() {
    this.isLogined = false;
    this.#me = null;
    Storage.local('me', null);
    Storage.session('token', null);
    this.#router.navigate(['/auth/login']);
  }
}
