import React from 'react';
import { Icon } from '/@/components/Icon';
import classNames from 'classnames';
import { useDesign } from '/@/hooks/web/useDesign';

import './index.less';

interface BasicArrowProp {
  /**
   * Arrow expand state
   */
  expand?: boolean;
  /**
   * Arrow up by default
   */
  up?: boolean;
  /**
   * Arrow down by default
   */
  down?: boolean;
  /**
   * Cancel padding/margin for inline
   */
  inset?: boolean;

  iconStyle?: React.CSSProperties;
}

const BasicArrow: React.FC<BasicArrowProp> = (props) => {
  const { expand, up, down, inset, iconStyle } = props;
  const { prefixCls } = useDesign('basic-arrow');

  // get component class
  const getClass = classNames(prefixCls, {
    [`${prefixCls}--active`]: expand,
    up,
    inset,
    down,
  });
  return (
    <span className={getClass}>
      <Icon icon="ion:chevron-forward" style={iconStyle} />
    </span>
  );
};

export default BasicArrow;
