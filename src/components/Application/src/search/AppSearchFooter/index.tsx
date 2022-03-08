import React from 'react';
import classNames from 'classnames';
import AppSearchKeyItem from '../AppSearchKeyItem';
import { useDesign } from '/@/hooks/web/useDesign';

import './index.less';

interface AppSearchFooterProp {
  className?: string;
}

const AppSearchFooter: React.FC<AppSearchFooterProp> = (props) => {
  const { className } = props;
  const { prefixCls } = useDesign('app-search-footer');
  return (
    <div className={classNames(prefixCls, className)}>
      <AppSearchKeyItem className={`${prefixCls}-item`} icon="ant-design:enter-outlined" />
      <span>确认</span>
      <AppSearchKeyItem className={`${prefixCls}-item`} icon="ion:arrow-up-outline" />
      <AppSearchKeyItem className={`${prefixCls}-item`} icon="ion:arrow-down-outline" />
      <span>切换</span>
      <AppSearchKeyItem className={`${prefixCls}-item`} icon="mdi:keyboard-esc" />
      <span>关闭</span>
    </div>
  );
};

export default AppSearchFooter;
