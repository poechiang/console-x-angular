export interface DebounceOptions {
  leading?: boolean;
  maxWait?: number;
  trailing?: boolean;
  wait?: number;
}
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  options?: boolean | number | DebounceOptions,
): ((...args: Parameters<T>) => void) => {
  let finalOpt: DebounceOptions;
  let lastArgs: Parameters<T>;
  if (typeof options === 'boolean') {
    finalOpt = { leading: true };
  } else if (typeof options === 'number') {
    finalOpt = { wait: options };
  } else {
    finalOpt = options as DebounceOptions;
  }

  const { wait, maxWait, trailing, leading } = { wait: 0, leading: false, trailing: true, ...finalOpt };

  let timeoutDelay: ReturnType<typeof setTimeout> | null = null;
  let timeoutMax: ReturnType<typeof setTimeout> | null = null;

  // wait期间的触发次数
  // 如果延迟结束后triggers大于0，则调用回调，否则不需要
  let triggers = 0;
  const clearDelayTimer = () => {
    if (timeoutDelay) {
      clearTimeout(timeoutDelay);
      timeoutDelay = null;
    }
  };
  const clearMaxTimer = () => {
    if (timeoutMax) {
      clearTimeout(timeoutMax);
      timeoutMax = null;
    }
  };
  return function (...args: Parameters<T>): void {
    lastArgs = args;
    if (timeoutDelay) {
      clearDelayTimer();
    }
    if (leading && !triggers) func(...lastArgs);

    triggers++; // timeoutDelay有值蛙表示连续触发，计数

    timeoutDelay = setTimeout(() => {
      if (triggers && trailing) {
        func(...lastArgs);
        triggers = 0;
      }
      clearMaxTimer();
    }, wait);
    if (!timeoutMax && maxWait) {
      timeoutMax = setTimeout(() => {
        if (triggers && trailing) {
          func(...lastArgs);
          triggers = 0;
        }
        clearDelayTimer();
        clearMaxTimer();
      }, maxWait);
    }
  };
};
