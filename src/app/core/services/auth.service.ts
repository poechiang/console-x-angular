import { inject, Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounce } from '@lib/utils/debounce';
import { Storage } from 'src/app/libs/Storage.class';
import { HttpsService } from './https.service';
import { StorageService } from './storage.service';

const MAX_WAIT_HEARTBEAT_INTERVAL = 300000; // 5 minutes
const MIN_WAIT_HEARTBEAT_INTERVAL = 300; // 0.3 second
const MIN_FROZEN_HEARTBEAT_INTERVAL = 240000; // 4 minutes
@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit, OnDestroy {
  #https = inject(HttpsService);
  #storage = inject(StorageService);
  #router = inject(Router);
  needHeartbeat = false;

  constructor() {
    ['mousemove', 'keydown', 'click', 'scroll'].forEach(event => {
      window.addEventListener(event, () => this.heartbeat());
    });
  }
  ngOnInit(): void {
    console.log('AuthService Init');
  }
  ngOnDestroy(): void {
    console.log('AuthService Destroy');
  }

  get lastHeartbeatAt() {
    return this.#storage.local<number>('lastHeartbeatAt') ?? 0;
  }
  set lastHeartbeatAt(value: number) {
    this.#storage.local<number>('lastHeartbeatAt', value);
  }

  heartbeat = debounce(
    async () => {
      if (!this.needHeartbeat || Date.now() - this.lastHeartbeatAt < MIN_FROZEN_HEARTBEAT_INTERVAL) {
        return;
      }

      this.lastHeartbeatAt = Date.now();
      try {
        await this.#https.post('/auth/heartbeat');
      } catch (err) {
        this.lastHeartbeatAt = 0;
        throw err;
      }
    },
    { wait: MIN_WAIT_HEARTBEAT_INTERVAL, maxWait: MAX_WAIT_HEARTBEAT_INTERVAL },
  );
  #me: User | null = Storage.local('me');
  get me(): User | null {
    return this.#me;
  }

  private set me(value: User) {
    this.#me = value;
    Storage.local('me', value, 1200000);
  }

  async login(params: { userName: string; password: string }) {
    const token = await this.#https.post('/auth/token', params, { credentials: 'include' });
    if (token) {
      Storage.session('token', token, 1200000);
      this.me = await this.#https.get('/users/me', null, { feedbackOnError: false });
    }
    return !!token;
  }

  async logout() {
    await this.#https.post('/auth/logout');
    this.afterLogout();
  }

  private afterLogout(redirect?: string) {
    this.#me = null;
    Storage.local('me', null);
    Storage.session('token', null);
    this.#router.navigateByUrl(`/auth/login${redirect ? '?redirect=' + encodeURIComponent(redirect) : ''}`);
  }
}
