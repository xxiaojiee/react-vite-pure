import { useState, useRef, useCallback, useEffect } from 'react';
import { useMount, useUnmount } from 'ahooks';
import { isFunction } from '/@/utils/is';

export function useTimeoutRef(wait: number) {
  const [ready, setReady] = useState(false);
  const timer = useRef<TimeoutHandle | null>(null);
  const stop = useCallback(() => {
    setReady(false);
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, [])
  const start = useCallback(() => {
    stop();
    timer.current = setTimeout(() => {
      setReady(true);
    }, wait);
  }, [stop, wait])
  useMount(start)
  useUnmount(stop);
  return { ready, stop, start };
}

export function useTimeoutFn(handle: Fn<any>, wait: number, native = false) {
  if (!isFunction(handle)) {
    throw new Error('handle is not Function!');
  }

  const { ready, stop, start } = useTimeoutRef(wait);
  useMount(() => {
    if (native) {
      handle();
    }
  })
  useEffect(() => {
    if (ready) {
      handle()
    }
  }, [handle, ready])
  return { ready, stop, start };
}

