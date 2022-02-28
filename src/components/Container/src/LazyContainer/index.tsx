import React, { useRef, useState } from 'react';
import { Skeleton } from 'antd';
import { useTimeoutFn } from '/@/hooks/core/useTimeout';
import { useMount } from 'ahooks';
import { useIntersectionObserver } from '/@/hooks/event/useIntersectionObserver';
import { Transition } from '/@/components/Transition';

interface LazyContainerProp {
  /**
   * Waiting time, if the time is specified, whether visible or not, it will be automatically loaded after the specified time
   */
  timeout?: number;
  /**
   * The viewport where the component is located.
   * If the component is scrolling in the page container, the viewport is the container
   */
  viewport: HTMLElement;
  /**
   * Preload threshold, css unit
   */
  threshold?: string;
  /**
   * The scroll direction of the viewport, vertical represents the vertical direction, horizontal represents the horizontal direction
   */
  direction?: 'vertical' | 'horizontal';
  /**
   * The label name of the outer container that wraps the component
   */
  tag?: string;
  maxWaitingTime?: number;
  /**
   * transition name
   */
  transitionName?: string;
  init: () => void;
  skeleton?: React.ReactNode;
}

const LazyContainer: React.FC<LazyContainerProp> = (props) => {
  const {
    threshold = '0px',
    direction = 'vertical',
    maxWaitingTime = 80,
    transitionName = 'lazy-container',
    init,
    viewport,
    timeout,
    children,
    skeleton,
    ...otherProps
  } = props;
  const elRef = useRef<ElRef>(null);
  const [isInit, setIsInit] = useState(false);
  const [loading, setLoading] = useState(false);
  const { start: initStart } = useTimeoutFn(() => {
    if (isInit) return;
    setIsInit(true);
    init && init();
  }, maxWaitingTime);
  function inits() {
    setLoading(true);
    initStart();
  }
  const { start: immediateInitStart } = useTimeoutFn(() => {
    inits();
  }, timeout || 0);
  const {
    start: startObserver,
    stop,
    observer,
  } = useIntersectionObserver({
    rootMargin: direction === 'vertical' ? `${threshold} 0px` : `0px ${threshold}`,
    target: elRef.current,
    onIntersect: (entries: any[]) => {
      const isIntersecting = entries[0].isIntersecting || entries[0].intersectionRatio;
      if (isIntersecting) {
        init();
        if (observer) {
          stop();
        }
      }
    },
    root: viewport,
  });
  function initIntersectionObserver() {
    if (timeout) return;
    try {
      startObserver();
    } catch (e) {
      init();
    }
  }
  // If there is a set delay time, it will be executed immediately
  function immediateInit() {
    if (timeout) {
      immediateInitStart();
    }
  }
  useMount(() => {
    immediateInit();
    initIntersectionObserver();
  });

  return (
    <Transition className="h-full w-full" name={transitionName} mode="out-in" {...otherProps}>
      {isInit ? React.cloneElement(children as React.ReactElement, { loading }) : (skeleton || <Skeleton />)}
    </Transition>
  );
};

export default LazyContainer;
