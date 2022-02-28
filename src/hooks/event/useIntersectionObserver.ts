import { useRef, useCallback } from 'react';

interface IntersectionObserverProps {
  target: Element | null | undefined;
  root?: any;
  onIntersect: IntersectionObserverCallback;
  rootMargin?: string;
  threshold?: number;
}

export function useIntersectionObserver({
  target,
  root,
  onIntersect,
  rootMargin = '0px',
  threshold = 0.1,
}: IntersectionObserverProps) {
  const observer = useRef<Nullable<IntersectionObserver>>(null);
  const isOpenObserver = useRef(true);
  const cleanup = useCallback(() => {
    if (observer.current) {
      observer.current.disconnect();
      target && observer.current.unobserve(target);
      isOpenObserver.current = false;
    }
  }, [target]);
  const start = useCallback(() => {
    if (!isOpenObserver.current) {
      return;
    }
    observer.current = new IntersectionObserver(onIntersect, {
      root,
      rootMargin,
      threshold,
    });
    const current = target;
    current && observer.current.observe(current);
  }, [onIntersect, root, rootMargin, target, threshold])
  return {
    observer,
    start,
    stop: () => {
      cleanup();
    },
  };
}
