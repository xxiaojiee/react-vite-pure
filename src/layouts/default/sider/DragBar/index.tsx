import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useDesign } from '/@/hooks/web/useDesign';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';

import './index.less';

interface DragBarProp {
  className?: string;
  mobile?: boolean;
}

const DragBar: React.FC<DragBarProp> = (props) => {
  const { className, mobile = false } = props;
  const { miniWidthNumber, collapsed, canDrag } = useMenuSetting();

  const { prefixCls } = useDesign('darg-bar');
  const getDragBarStyle = useMemo(() => {
    if (collapsed) {
      return { left: `${miniWidthNumber}px` };
    }
    return {};
  }, [collapsed, miniWidthNumber]);

  const getClass = classNames(prefixCls, className, {
    [`${prefixCls}--hide`]: !canDrag || mobile,
  });

  return <div className={getClass} style={getDragBarStyle} />;
};

export default DragBar;
