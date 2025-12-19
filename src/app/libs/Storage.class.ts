export abstract class Storage {
  private constructor() {}
  /**
   * 读取localStorage
   * @param key 缓存key
   * @returns 如果存在，返回缓存内容，否则返回null
   */
  static local<T>(key: string): T | null;
  /**
   * 将指定内容写入localStorage
   * @param key 缓存key
   * @param value 缓存内容
   * @param expire 过期时间，单位毫秒
   */
  static local<T>(key: string, value: T | null, expire?: number): void;

  static local<T>(key: string, value?: T, expire?: number): void | T | null {
    const now = Date.now();
    if (value === undefined) {
      const item = localStorage.getItem(key);
      if (!item) return null;
      const data = JSON.parse(item);
      if (data.expire && data.expire < now) {
        localStorage.removeItem(key);
        return null;
      }
      return data.value;
    } else if (value === null) {
      localStorage.removeItem(key);
    } else {
      const data: any = { value };
      if (expire) {
        data.expire = now + expire;
      }
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  /**
   * 读取sessionStorage
   * @param key 缓存键名
   * @returns 如果存在，返回缓存内容，否则返回null
   */
  static session<T>(key: string): T | null;
  /**
   * 写入sessionStorage
   * @param key 缓存键名
   * @param value 缓存内容
   * @param expire 过期时间，单位毫秒
   */
  static session<T>(key: string, value: T | null, expire?: number): void;
  static session<T>(key: string, value?: T, expire?: number): void | T | null {
    const now = Date.now();
    if (value === undefined) {
      const item = sessionStorage.getItem(key);
      if (!item) return null;
      const data = JSON.parse(item);
      if (data.expire && data.expire < now) {
        sessionStorage.removeItem(key);
        return null;
      }
      return data.value;
    } else if (value === null) {
      sessionStorage.removeItem(key);
    } else {
      const data: any = { value };
      if (expire) {
        data.expire = now + expire;
      }
      sessionStorage.setItem(key, JSON.stringify(data));
    }
  }

  /**
   * 读取或写入cookie
   * @param name cookie名称
   * @param value cokkie内容
   * @param days 过期时间，单位毫秒
   * @returns
   */
  static cookie(name: string): string {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return decodeURIComponent(match?.[2] ?? '');
  }
}
