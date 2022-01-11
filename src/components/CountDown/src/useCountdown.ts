
import { useCallback, useState, useRef } from 'react';
import { useUnmount } from 'ahooks';

export function useCountdown(count: number) {
  const [currentCount, setCurrentCount] = useState(count);

  const [isStart, setIsStart] = useState(false);

  const timerId = useRef<ReturnType<typeof setInterval> | null>(null);

  function clear() {
    if (timerId.current) {
      timerId && window.clearInterval(timerId.current);
    }
  }

  const stop = useCallback(() => {
    setIsStart(false)
    clear();
    timerId.current = null;
  },[])

  const start = useCallback(() => {
    if (isStart || !!timerId.current) {
      return;
    }
    setIsStart(true)
    timerId.current = setInterval(() => {
      if (currentCount === 1) {
        stop();
        setCurrentCount(count)
      } else {
        setCurrentCount(curCount => curCount - 1)
      }
    }, 1000);
  }, [count, currentCount, isStart, stop])


  const reset = useCallback(() => {
    setCurrentCount(count)
    stop();
  },[count, stop, setCurrentCount])

  const restart = useCallback(() => {
    reset();
    start();
  },[reset, start])

  useUnmount(() => {
    reset();
  });

  return { start, reset, restart, clear, stop, currentCount, isStart };
}
