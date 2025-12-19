import { EventEmitter, inject, Injectable } from '@angular/core';
import merge from '@lib/utils/merge';
import { pickBy } from '@utl/pickBy';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { Storage } from 'src/app/libs/Storage.class';

type HttpsOptions = RequestInit & {
  feedbackOnError?: boolean;
};
const STATUS_CODE_MAP: Record<number, string> = {
  401: '未授权，请登录',
  403: '没有权限',
  404: '请求地址不存在',
  500: '服务器异常',
  502: '网关异常',
  503: '服务不可用',
};
@Injectable({
  providedIn: 'root',
})
export class HttpsService {
  #domain = 'http://localhost:10010';
  #version = 'api/v1';
  #notify = inject(NzNotificationService);
  #config: HttpsOptions = {
    mode: 'cors',
    credentials: 'include',
  };

  get config() {
    return this.#config;
  }

  set config(value: any) {
    this.#config = merge({}, this.#config, value);
  }

  #onNetworkFeedback = new EventEmitter<Response>(true);

  get onNextworkFeedback() {
    return this.#onNetworkFeedback as Observable<Response>;
  }

  async head(url: string) {
    const fullUrl = this.parseUrl(url);
    const finalOptions = this.parseOptions({ method: 'HEAD' });
    const res = await this.doInvoke(fullUrl, finalOptions);

    this.postPayloadFeedback(res);
    return res?.code ? null : res;
  }
  async get(url: string, query?: Record<string, any> | null, options?: HttpsOptions) {
    const fullUrl = this.parseUrl(url, query);
    const finalOptions = this.parseOptions(options);
    const res = await this.doInvoke(fullUrl, finalOptions);

    this.postPayloadFeedback(res, finalOptions);
    return res?.code ? null : (res?.payload ?? res);
  }
  async post<T extends Record<string, any>>(url: string, params?: T, options?: HttpsOptions) {
    const fullUrl = this.parseUrl(url);
    const finalOptions = this.parseOptions({
      ...options,
      method: 'POST',
      body: JSON.stringify(pickBy(params ?? {})),
    });
    const res = await this.doInvoke(fullUrl, finalOptions);

    this.postPayloadFeedback(res);
    return res?.code ? null : (res?.payload ?? res);
  }

  private parseUrl(path: string, query?: Record<string, any> | null) {
    const [base, queryStr] = path.split('?');
    const queryObj = (queryStr ?? '')
      .split('&')
      .filter(Boolean)
      .reduce((o, kvPaire) => {
        const [k, v] = kvPaire;
        return { ...o, [k]: v };
      }, query ?? {});

    const finalQueryStr = Object.entries(queryObj)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    let finalPath;
    if (base.startsWith('http')) {
      finalPath = base;
    } else {
      finalPath = [this.#domain, this.#version, ...base.split('/').filter(Boolean)].join('/');
    }
    return [finalPath, finalQueryStr].filter(Boolean).join('?');
  }

  private async doInvoke(url: string, options?: HttpsOptions) {
    try {
      const response = await fetch(url, options);
      return this.postNetworkFeedback(response, options);
    } catch (e: any) {
      if (options?.feedbackOnError !== false) {
        this.#notify.error(`[未知异常]${e.message}`, url);
      }
      return null;
    }
  }
  private postNetworkFeedback(response: any, options?: HttpsOptions) {
    if (!response.ok) {
      const showFeedback = response.status === 401 || options?.feedbackOnError !== false;
      if (showFeedback) {
        this.#notify
          .error(`[${response.status}] ${this.getErrorMessage(response.status) ?? response.statusText}`, response.url)
          .onClose.subscribe(() => {
            this.#onNetworkFeedback.next(response);
          });
      } else {
        this.#onNetworkFeedback.next(response);
      }

      return null;
    } else {
      return response.json();
    }
  }

  private postPayloadFeedback(data: any, options?: HttpsOptions) {
    const { code, message, suggestions } = data ?? {};

    if (options?.feedbackOnError !== false && code) {
      this.#notify.error(`[${code}]${message}`, suggestions);
    }
  }

  private parseOptions(options?: HttpsOptions): HttpsOptions {
    let finalOptions: Partial<HttpsOptions>;
    if (!options || typeof options === 'string') {
      finalOptions = { method: options ?? 'GET' };
    } else {
      finalOptions = { ...options };
    }

    const { headers = {}, method = 'GET', ...restOptions } = options ?? {};
    const finalHeaders: Record<string, any> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    const token = Storage.session('token');
    if (token) {
      finalHeaders['Authorization'] = `Bearer ${token}`;
    }
    return merge({}, this.config, finalOptions, { headers: finalHeaders });
  }

  private getErrorMessage(status: number) {
    let defMsg;
    if (status > 500) {
      defMsg = '服务器异常';
    } else if (status >= 400) {
      defMsg = '请求参数异常';
    } else if (status >= 300) {
      defMsg = '重定向异常';
    } else {
      defMsg = '网络异常';
    }

    return STATUS_CODE_MAP[status] ?? defMsg;
  }
}
