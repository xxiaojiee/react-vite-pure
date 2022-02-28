import { useRef } from 'react';
import { isFunction } from '/@/utils/is';

export interface ParamsProps {
  el: any;
  to: number;
  duration?: number;
}

const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t + b;
  }
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

const move = (el: HTMLElement, amount: number) => {
  el.scrollTop = amount;
};

const position = (el: HTMLElement) => {
  return el.scrollTop;
};
export function useScrollTo(callback?: () => any) {
  const params = useRef<ParamsProps | null>(null);
  const increment = 20;
  let currentTime = 0;

  const animateScroll = function () {
    if (!params.current) {
      return;
    }
    const { el, to, duration = 500 } = params.current;
    const start = position(el);
    const change = to - start;
    currentTime += increment;
    const val = easeInOutQuad(currentTime, start, change, duration);
    move(el, val);
    if (currentTime < duration && params.current) {
      requestAnimationFrame(animateScroll);
    } else if (callback && isFunction(callback)) {
      callback();
    }
  };
  const run = (options: ParamsProps) => {
    params.current = options;
    animateScroll();
  };

  const stop = () => {
    params.current = null;
  };

  return { start: run, stop };
}
