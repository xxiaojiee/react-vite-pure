import React, { useRef } from 'react';
import { useUnmount } from 'ahooks';
import classNames from 'classnames';

import { on, off } from '/@/utils/domUtils';
import { renderThumbStyle, BAR_MAP } from './util';

interface ScrollbarProp {
  vertical?: boolean;
  size: string;
  move: number;
  wrap: any;
}

const BarIndex: React.FC<ScrollbarProp> = (props) => {
  const { vertical = false, size, move, wrap } = props;
  const thumb = useRef<ElRef>(null);
  const divRef = useRef<ElRef>(null);
  const bar = BAR_MAP[vertical ? 'vertical' : 'horizontal'];
  const barStore = useRef<Recordable>({});
  const cursorDown = useRef(false);
  const clickThumbHandler = (e: any) => {
    // prevent click event of right button
    if (e.ctrlKey || e.button === 2) {
      return;
    }
    window.getSelection()?.removeAllRanges();
    startDrag(e);
    barStore.current[bar.axis] =
      e.currentTarget[bar.offset] -
      (e[bar.client] - e.currentTarget.getBoundingClientRect()[bar.direction]);
  };

  const clickTrackHandler = (e: any) => {
    const offset = Math.abs(e.target.getBoundingClientRect()[bar.direction] - e[bar.client]);
    const thumbHalf = thumb.current?.[bar.offset] / 2;
    const thumbPositionPercentage = ((offset - thumbHalf) * 100) / divRef.current?.[bar.offset];

    wrap.current[bar.scroll] = (thumbPositionPercentage * wrap.current[bar.scrollSize]) / 100;
  };
  const startDrag = (e: any) => {
    e.stopImmediatePropagation();
    cursorDown.current = true;
    on(document, 'mousemove', mouseMoveDocumentHandler);
    on(document, 'mouseup', mouseUpDocumentHandler);
    document.onselectstart = () => false;
  };

  const mouseMoveDocumentHandler = (e: any) => {
    if (cursorDown.current === false) return;
    const prevPage = barStore.current[bar.axis];

    if (!prevPage) return;

    const offset = (divRef.current?.getBoundingClientRect()[bar.direction] - e[bar.client]) * -1;
    const thumbClickPosition = thumb.current?.[bar.offset] - prevPage;
    const thumbPositionPercentage =
      ((offset - thumbClickPosition) * 100) / divRef.current?.[bar.offset];
    wrap.current[bar.scroll] = (thumbPositionPercentage * wrap.current[bar.scrollSize]) / 100;
  };

  function mouseUpDocumentHandler() {
    cursorDown.current = false;
    barStore.current[bar.axis] = 0;
    off(document, 'mousemove', mouseMoveDocumentHandler);
    document.onselectstart = null;
  }
  useUnmount(() => {
    off(document, 'mouseup', mouseUpDocumentHandler);
  });
  return React.createElement(
    'div',
    {
      ref: divRef,
      className: classNames('scrollbar__bar', `is-${bar.key}`),
      onMousedown: clickTrackHandler,
    },
    React.createElement('div', {
      ref: thumb,
      className: 'scrollbar__thumb',
      onMousedown: clickThumbHandler,
      style: renderThumbStyle({
        size,
        move,
        bar,
      }),
    }),
  );
};

export default BarIndex;
