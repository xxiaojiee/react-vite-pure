import React from 'react';
import { BasicTitle } from '/@/components/Basic';
import { ArrowLeftOutlined } from '@ant-design/icons';
import classNames from 'classnames';

import { useDesign } from '/@/hooks/web/useDesign';
import './index.less';

interface DrawerHeaderProp {
  isDetail?: boolean;
  showDetailBack?: boolean;
  title?: React.ReactNode;
  titleToolbar?: React.ReactNode;
  onClose?: (e?: EventType) => Promise<void> | undefined;
}

const DrawerHeader: React.FC<DrawerHeaderProp> = (props) => {
  const { showDetailBack, title, isDetail } = props;
  const { prefixCls } = useDesign('basic-drawer-header');

  const handleClose = () => {
    props.onClose?.();
  };

  return isDetail ? (
    <div className={classNames(prefixCls, `${prefixCls}--detail`)}>
      <span className={`${prefixCls}__twrap`}>
        {showDetailBack ? (
          <span onClick={handleClose}>
            <ArrowLeftOutlined className={`${prefixCls}__back`} />
          </span>
        ) : null}
        {title ? <span>{title}</span> : null}
      </span>
      <span className={`${prefixCls}__toolbar`}>{props.titleToolbar}</span>
    </div>
  ) : (
    <BasicTitle className={prefixCls}>{props.title || ''}</BasicTitle>
  );
};

export default DrawerHeader;
