import React, { useRef, useImperativeHandle, useCallback } from 'react';
import { Scrollbar, ScrollbarType } from '/@/components/Scrollbar';
import { useScrollTo } from '/@/hooks/event/useScrollTo';

const ScrollContainer: React.FC = (props, ref) => {
  const { children, ...otherProp } = props;
  const scrollbarRef = useRef<Nullable<ScrollbarType>>(null);
  const { start } = useScrollTo();
  /**
   * Scroll to the specified position
   */
  const scrollTo = useCallback(
    (to: number, duration = 500) => {
      const scrollbar = scrollbarRef.current;
      if (!scrollbar) {
        return;
      }
      const wrap = scrollbar;
      if (!wrap) {
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
    const scrollbar = scrollbarRef.current;
    if (!scrollbar) {
      return null;
    }
    return scrollbar.wrap;
  };

  /**
   * Scroll to the bottom
   */
  const scrollBottom = () => {
    const scrollbar = scrollbarRef.current;
    if (!scrollbar) {
      return;
    }
    const { wrap } = scrollbar;
    if (!wrap) {
      return;
    }
    const scrollHeight = wrap.scrollHeight as number;
    start({
      el: wrap,
      to: scrollHeight,
    });
  }
  useImperativeHandle(ref, () => ({
    getScrollWrap,
    scrollBottom,
    scrollTo,
  }));
  return (
    <Scrollbar ref={scrollbarRef} className="scroll-container" {...otherProp}>
      {children}
    </Scrollbar>
  );
};

export default React.forwardRef(ScrollContainer);
