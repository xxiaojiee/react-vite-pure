import { useRef, useCallback } from 'react';
import { useUnmount } from 'ahooks';
import { isFunction } from '/@/utils/is';

export function useTimeoutFn(handle: Fn<any>, wait: number, native = false) {
  if (!isFunction(handle)) {
    throw new Error('handle is not Function!');
  }
  const timer = useRef<TimeoutHandle | null>(null);
  const stop = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, [])
  const start = useCallback((params?: any) => {
    stop();
    if (native) {
      handle(params);
    }
    timer.current = setTimeout(() => {
      handle(params);
    }, wait);
  }, [handle, native, stop, wait])

  useUnmount(stop);

  return { stop, start };
}

