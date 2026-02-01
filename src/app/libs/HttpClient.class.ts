import { Storage } from '@lib/Storage.class';
import merge from '@lib/utils/merge';
import { pickBy } from '@utl/pickBy';

export type HttpsOptions = RequestInit & {
  domain?: string;
  port?: number;
  path?: string;
  feedbackOnError?: boolean;
};

interface HttpsErrorContext {
  url: string;
  options?: Partial<HttpsOptions>;
  path: string;
  response?: Response;
  code?: number;
  suggestions?: string;
}

export class HttpError extends Error {
  readonly context?: HttpsErrorContext;
  handled = false;
  get code() {
    return this.context?.code;
  }

  get suggestions() {
    return this.context?.suggestions;
  }

  constructor(message: string, context?: HttpsErrorContext) {
    super(message);
    this.context = context;
  }
}

const STATUS_CODE_MAP: Record<number, string> = {
  401: '未授权，请登录',
  403: '没有权限',
  404: '请求地址不存在',
  500: '服务器异常',
  502: '网关异常',
  503: '服务不可用',
};

export class HttpsClient {
  #config: HttpsOptions = {
    domain: 'http://localhost',
    port: 80,
    path: '',
    mode: 'same-origin',
    credentials: 'same-origin',
  };

  async head(url: string) {
    const fullUrl = this.parseUrl(url);
    const finalOptions = this.parseOptions({ method: 'HEAD' });
    return (await this.fetch(fullUrl, finalOptions)) ?? null;
  }
  async get(url: string, query?: Record<string, any> | null, options?: HttpsOptions) {
    const fullUrl = this.parseUrl(url, query);
    return await this.fetch(fullUrl, options);
  }
  async post<T extends Record<string, any>>(url: string, params?: T, options?: HttpsOptions) {
    const fullUrl = this.parseUrl(url);

    return await this.fetch(fullUrl, {
      ...options,
      method: 'POST',
      body: JSON.stringify(pickBy(params ?? {})),
    });
  }

  async patch<T extends Record<string, any>>(url: string, params?: T, options?: HttpsOptions) {
    const fullUrl = this.parseUrl(url);

    return await this.fetch(fullUrl, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(pickBy(params ?? {})),
    });
  }

  async put<T extends Record<string, any>>(url: string, params?: T, options?: HttpsOptions) {
    const fullUrl = this.parseUrl(url);

    return await this.fetch(fullUrl, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(pickBy(params ?? {})),
    });
  }

  async delete(url: string, options?: HttpsOptions) {
    const fullUrl = this.parseUrl(url);

    return await this.fetch(fullUrl, {
      ...options,
      method: 'DELETE',
    });
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
      const domain = this.#config.domain;
      const port = this.#config.port;
      const path = this.#config.path?.split('/').filter(Boolean).join('/');
      finalPath = [`${domain}:${port}`, path, ...base.split('/').filter(Boolean)].join('/');
    }
    return [finalPath, finalQueryStr].filter(Boolean).join('?');
  }

  async fetch(url: string, options?: HttpsOptions) {
    let response: Response | null = null;
    let data: any = null;
    try {
      response = await fetch(url, this.parseOptions(options));

      data = await response?.json().catch(() => null);
      if (options?.feedbackOnError !== false && (!response.ok || data?.code)) {
        throw new Error(data?.message ?? this.getErrorMessage(response.status));
      }

      return data?.code === 0 ? (data?.payload ?? {}) : null;
    } catch (err: any) {
      throw new HttpError(err.message, {
        code: data?.code ?? response?.status ?? 0,
        url,
        path: url.replace(this.#config.domain ?? '', '').replace(`:${this.#config.port}`, ''),
        suggestions: data?.suggestions ?? '',
        options,
      });
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
    return merge({}, this.#config, finalOptions, { headers: finalHeaders });
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

  static config(cfg: HttpsOptions) {
    const client = new HttpsClient();
    client.#config = merge({}, client.#config, cfg);
    return client;
  }
}
