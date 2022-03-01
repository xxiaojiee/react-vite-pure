
import { useMount, useUnmount, useDebounceFn } from 'ahooks';

interface WindowSizeOptions {
  once?: boolean;
  immediate?: boolean;
  listenerOptions?: AddEventListenerOptions | boolean;
}

export function useWindowSizeFn<T>(fn: Fn<T>, wait = 150, options?: WindowSizeOptions) {
  const { run } = useDebounceFn(
    () => {
      fn();
    },
    {
      wait,
    },
  );

  const start = () => {
    if (options && options.immediate) {
      run();
    }
    window.addEventListener('resize', run);
  };

  const stop = () => {
    window.removeEventListener('resize', run);
  };

  useMount(() => {
    start();
  });

  useUnmount(() => {
    stop();
  });
  return [start, stop];
}
