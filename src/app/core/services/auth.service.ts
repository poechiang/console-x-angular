import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from 'src/app/libs/Storage.class';
import { HttpsService } from './https.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #https = inject(HttpsService);
  private async getMyInfo() {
    this.me = await this.#https.get('/users/me', null, { feedbackOnError: false });

    return this.me !== null;
  }

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
      await this.getMyInfo();
    }
    return !!token;
  }

  async logout() {
    await this.#https.post('/auth/logout');
    this.#me = null;
    Storage.local('me', null);
    Storage.session('token', null);
  }
}
