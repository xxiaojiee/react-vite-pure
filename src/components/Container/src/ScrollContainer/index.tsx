import React, { useRef, useImperativeHandle, useCallback } from 'react';
import { Scrollbar, ScrollbarType } from '/@/components/Scrollbar';
import { useScrollTo } from '/@/hooks/event/useScrollTo';

const ScrollContainer: React.FC<Record<string, any>> = (props, ref) => {
  const { children, ...otherProp } = props;
  const scrollbarRef = useRef<ScrollbarType>(null);
  const { start } = useScrollTo();
  /**
   * Scroll to the specified position
   */
  const scrollTo = useCallback(
    (to: number, duration = 500) => {
      const { scrollbar, wrap } = scrollbarRef.current || {};
      if (!wrap || scrollbar) {
        return;
      }
      start({
        el: wrap,
        to,
        duration,
      });
    },
    [start],
  );

  const getScrollWrap = () => {
    return scrollbarRef.current?.wrap;
  };

  /**
   * Scroll to the bottom
   */
  const scrollBottom = useCallback(() => {
    const { scrollbar, wrap } = scrollbarRef.current || {};
    if (!wrap || !scrollbar) {
      return;
    }
    const scrollHeight = wrap.scrollHeight as number;
    start({
      el: wrap,
      to: scrollHeight,
    });
  }, [start]);
  useImperativeHandle(
    ref,
    () => ({
      ...scrollbarRef.current,
      getScrollWrap,
      scrollBottom,
      scrollTo,
    }),
    [scrollBottom, scrollTo],
  );
  return (
    <Scrollbar {...otherProp} ref={scrollbarRef} className="scroll-container">
      {children}
    </Scrollbar>
  );
};

export default React.forwardRef(ScrollContainer);
