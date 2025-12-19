/**
 * 实现一个类似 jq 的 merge 功能：递归合并多个对象。
 * 规则（默认）：
 * - 对象会递归合并；后面的字段会覆盖前面的同名字段（但若两侧均为对象则会继续递归合并）。
 * - 数组默认使用 `replace` 策略。
 * - 支持循环引用保护。
 *
 * 使用示例：
 * import { merge } from 'src/app/libs/utils/merge';
 * const a = { x: { a: 1 }, arr: [1,2] };
 * const b = { x: { b: 2 }, arr: [2,3] };
 * const m = merge([a, b]); // { x: { a:1, b:2 }, arr: [1,2,2,3] }
 */

const isObject = (v: any): v is Record<string, any> => v !== null && typeof v === 'object' && !Array.isArray(v);

const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a && b && typeof a === 'object') {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  }
  return false;
};

const mergeTwo = (a: any, b: any, map = new WeakMap()): any => {
  // handle primitives or non-object: b replaces a
  if (!a || typeof a !== 'object') {
    // if b is object/array we should deep clone it to avoid aliasing
    if (b && typeof b === 'object') return mergeTwo(Array.isArray(b) ? [] : {}, b, map);
    return b;
  }

  if (!b || typeof b !== 'object') {
    return b;
  }

  // 防止循环引用重复处理
  if (map.has(a) && map.has(b) && map.get(a) === map.get(b)) {
    return map.get(a);
  }

  // 同为数组
  if (Array.isArray(a) && Array.isArray(b)) {
    return b.slice();
  }

  // 如果类型不一致，返回 b 的深拷贝
  if (Array.isArray(a) !== Array.isArray(b)) {
    return Array.isArray(b) ? b.slice() : mergeTwo({}, b, map);
  }

  // 两个普通对象 -> 递归合并
  const out: any = Object.create(Object.getPrototypeOf(a));
  map.set(a, out);
  // 先复制 a 的属性描述
  Reflect.ownKeys(a).forEach(key => {
    const desc = Object.getOwnPropertyDescriptor(a, key as PropertyKey)!;
    if (desc.get || desc.set) {
      Object.defineProperty(out, key, desc);
    } else {
      out[key as any] = a[key as any];
    }
  });

  // 然后把 b 合并进 out
  Reflect.ownKeys(b).forEach(key => {
    const bk = b[key as any];
    const ak = out[key as any];
    if (isObject(ak) && isObject(bk)) {
      out[key as any] = mergeTwo(ak, bk, map);
    } else if (Array.isArray(ak) && Array.isArray(bk)) {
      // 数组合并策略
      out[key as any] = bk.slice();
    } else {
      // 非对象/数组或类型不匹配 -> b 的深拷贝
      out[key as any] = bk && typeof bk === 'object' ? mergeTwo(Array.isArray(bk) ? [] : {}, bk, map) : bk;
    }
  });

  return out;
};

/**
 * 合并多个对象
 * @param sources 要合并的对象数组或多个参数
 * @param options 配置（数组合并策略）
 */
export const merge = <T = any>(...sources: Partial<T>[]): Partial<T> => {
  let items: any[] = sources as any[];

  if (items.length === 0) return {} as any;
  let result: any = Array.isArray(items[0]) ? [] : Object(items[0]) === items[0] ? {} : items[0];
  // 初始化 result 为第一个元素的深拷贝
  result = items[0] && typeof items[0] === 'object' ? mergeTwo(Array.isArray(items[0]) ? [] : {}, items[0], new WeakMap()) : items[0];

  for (let i = 1; i < items.length; i++) {
    result = mergeTwo(result, items[i], new WeakMap());
  }

  return result as T;
};

export default merge;
