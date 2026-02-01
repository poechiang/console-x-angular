import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpError, HttpsClient, HttpsOptions } from '@lib/HttpClient.class';
import { Storage } from '@lib/Storage.class';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { lastValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpsService {
  #notify = inject(NzNotificationService);
  #router = inject(Router);
  #refreshing = false;
  #http = HttpsClient.config({
    domain: 'http://localhost',
    port: 10010,
    path: '/api/v1',
    mode: 'cors',
    // credentials: 'include',
  });

  #onError(err: HttpError) {
    const { code, message, context: { url, path } = {}, suggestions = '' } = err ?? {};

    console.log(`Error happened!!!,for url ${url}, with code ${code}`, err.context, err);
    if (code === 401 && !url?.endsWith('/auth/refresh')) {
      if (!this.#refreshing) {
        this.#refreshToken();
      }

      return this.#waitForRefresh(url!, err.context?.options);
    }

    const content = [message, suggestions].filter(Boolean).join('<br/>');
    return lastValueFrom(this.#notify.error(`[${code}] ${content}`, path!, { nzClass: 'http-notify' }).onClose.pipe(map(() => null)));
  }

  resolvers: ((arg0?: any) => void)[][] = [];
  #refreshToken() {
    this.#refreshing = true;
    console.log('Refreshing token...');
    this.#http
      .post('/auth/refresh', {}, { credentials: 'include' })
      .then(token => {
        Storage.session('token', token, 1200000);
        console.log('Token refreshed, and retrying requests...');
        this.resolvers.forEach(([resolve]) => resolve());
        this.resolvers = [];
      })
      .catch(err => {
        this.resolvers.forEach(([_, reject]) => reject(new Error('Refresh token failed')));
        console.log('Refresh token failed, redirecting to login page...');
        Storage.local('me', null);
        Storage.session('token', null);
        this.#router.navigateByUrl(`/auth/login`);
      })
      .finally(() => {
        this.#refreshing = false;
        this.resolvers = [];
      });
  }

  #waitForRefresh(url: string, options?: HttpsOptions) {
    return new Promise<void>((resolve, reject) => {
      this.resolvers.push([resolve, reject]);
    }).then((): any => {
      console.log(`Retrying requests for ${url} with options:`, options);
      return this.#http.fetch(url, options).catch(this.#onError.bind(this));
    });
  }

  async get(url: string, query?: any, options?: HttpsOptions) {
    return await this.#http.get(url, query, options).catch(this.#onError.bind(this));
  }

  async post(url: string, params?: any, options?: HttpsOptions) {
    return await this.#http.post(url, params, options).catch(this.#onError.bind(this));
  }

  async head(url: string) {
    return await this.#http.head(url).catch(this.#onError.bind(this));
  }

  async put(url: string, params?: any, options?: HttpsOptions) {
    return await this.#http.put(url, params, options).catch(this.#onError.bind(this));
  }

  async delete(url: string, options?: HttpsOptions) {
    return await this.#http.delete(url, options).catch(this.#onError.bind(this));
  }

  async patch(url: string, params?: any, options?: HttpsOptions) {
    return await this.#http.patch(url, params, options).catch(this.#onError.bind(this));
  }
}
