import React, { useState, useRef, useCallback, CSSProperties, useImperativeHandle } from 'react';
import { addResizeListener, removeResizeListener } from '/@/utils/event';
import componentSetting from '/@/settings/componentSetting';
import { useMount, useUnmount } from 'ahooks';
import classNames from 'classnames';
import Bar from '../Bar';

import './index.less';

const { scrollbar } = componentSetting;

interface ScrollbarProp {
  native?: boolean;
  wrapStyle?: CSSProperties;
  wrapClass?: string | any[];
  viewClass?: string | any[];
  viewStyle?: CSSProperties;
  noresize?: boolean; // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
  tag?: string;
  className?: string;
}

const Scrollbar: React.FC<ScrollbarProp> = (props, ref) => {
  const {
    native = scrollbar?.native ?? false,
    noresize = false,
    wrapStyle = {},
    wrapClass = '',
    viewClass = '',
    viewStyle = {},
    tag = 'div',
    children,
    className,
  } = props;
  const [sizeWidth, setSizeWidth] = useState('0');
  const [sizeHeight, setSizeHeight] = useState('0');
  const [moveX, setMoveX] = useState(0);
  const [moveY, setMoveY] = useState(0);
  const wrap = useRef<ElRef>(null);
  const scrollbarRef = useRef<ElRef>(null);
  const resize = useRef();
  useImperativeHandle(ref, () => ({
    scrollbar:scrollbarRef.current,
    wrap: wrap.current,
  }));
  const handleScroll = useCallback(() => {
    if (!native) {
      setMoveY(
        ((wrap.current?.scrollTop as number) * 100) / (wrap.current?.clientHeight as number),
      );
      setMoveX(
        ((wrap.current?.scrollLeft as number) * 100) / (wrap.current?.clientWidth as number),
      );
    }
  }, [native]);

  const update = () => {
    if (!wrap.current) return;
    const heightPercentage = (wrap.current?.clientHeight * 100) / wrap.current?.scrollHeight;
    const widthPercentage = (wrap.current?.clientWidth * 100) / wrap.current?.scrollWidth;
    setSizeHeight(heightPercentage < 100 ? `${heightPercentage}%` : '');
    setSizeWidth(widthPercentage < 100 ? `${widthPercentage}%` : '');
  };

  useMount(() => {
    if (native) return;
    update();
    if (!noresize) {
      addResizeListener(resize.current, update);
      addResizeListener(wrap.current, update);
      addEventListener('resize', update);
    }
  });

  useUnmount(() => {
    if (native) return;
    if (!noresize) {
      removeResizeListener(resize.current, update);
      removeResizeListener(wrap.current, update);
      removeEventListener('resize', update);
    }
  });
  return (
    <div className={classNames('scrollbar', className)} ref={scrollbarRef}>
      <div
        ref={wrap}
        className={classNames(
          wrapClass,
          'scrollbar__wrap',
          native ? '' : 'scrollbar__wrap--hidden-default',
        )}
        style={wrapStyle}
        onScroll={handleScroll}
      >
        {React.createElement(
          tag,
          {
            ref: resize,
            className: classNames('scrollbar__view', viewClass),
            style: viewStyle,
          },
          children,
        )}
      </div>
      {!native ? (
        <>
          <Bar move={moveX} size={sizeWidth} wrap={wrap} />
          <Bar vertical move={moveY} size={sizeHeight} wrap={wrap} />
        </>
      ) : null}
    </div>
  );
};

export default React.forwardRef(Scrollbar);
