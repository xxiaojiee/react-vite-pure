import React, { useState } from 'react';
import { Skeleton } from 'antd';
import { CollapseTransition } from '/@/components/Transition';
import CollapseHeader from '../CollapseHeader';
import { triggerWindowResize as triggerWindowResizeFn } from '/@/utils/event';
import { useTimeoutFn } from '/@/hooks/core/useTimeout';
import { useDesign } from '/@/hooks/web/useDesign';

interface CollapseContainerProp {
  title?: string;
  loading: boolean;
  /**
   *  Can it be expanded
   */
  canExpan: boolean;
  /**
   * Warm reminder on the right side of the title
   */
  helpMessage?: string[] | string;
  /**
   * Whether to trigger window.resize when expanding and contracting,
   * Can adapt to tables and forms, when the form shrinks, the form triggers resize to adapt to the height
   */
  triggerWindowResize?: boolean;
  /**
   * Delayed loading time
   */
  lazyTime?: number;
  footer?: React.ReactNode;
}

const CollapseContainer: React.FC<CollapseContainerProp> = (props) => {
  const {
    loading,
    footer,
    triggerWindowResize = false,
    children,
    ...otherPorps
  } = props;
  const [show, setShow] = useState(true);

  const { prefixCls } = useDesign('collapse-container');

  // 200 milliseconds here is because the expansion has animation,
  const { start } = useTimeoutFn(triggerWindowResizeFn, 200);

  /**
   * @description: Handling development events
   */
  const handleExpand = () => {
    setShow((preState) => !preState);
    if (triggerWindowResize) {
      start();
    }
  };
  return (
    <div className={prefixCls}>
      <CollapseHeader {...otherPorps} prefixCls={prefixCls} show={show} expand={handleExpand} />
      <div className="p-2">
        <CollapseTransition>
          {loading ? <Skeleton active={loading} /> : null}
          {show && !loading ? <div className={`${prefixCls}__body`}>{children}</div> : null}
        </CollapseTransition>
      </div>
      {footer ? <div className={`${prefixCls}__footer`}>{footer}</div> : null}
    </div>
  );
};

export default CollapseContainer;
