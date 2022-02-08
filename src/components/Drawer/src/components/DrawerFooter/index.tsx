import React from 'react';
import { Button } from 'antd';
import { useDesign } from '/@/hooks/web/useDesign';
import { FooterProps } from '../../typing';

import './index.less';

interface DrawerFooterProp extends FooterProps {
  onOk?: () => Promise<void> | void;
  onClose?: () => Promise<void> | void;
  height?: string | number;
}

const DrawerFooter: React.FC<DrawerFooterProp> = (props) => {
  const {
    height = '60px',
    showFooter,
    showOkBtn = true,
    showCancelBtn = true,
    cancelText = '取消',
    okText = '确认',
    confirmLoading,
    okButtonProps,
    okType = 'primary',
  } = props;
  const { prefixCls } = useDesign('basic-drawer-footer');

  const getStyle = (): React.CSSProperties => {
    const heightStr = `${height}`;
    return {
      height: heightStr,
      lineHeight: heightStr,
    };
  };

  const handleOk = () => {
    props.onOk?.();
  };

  const handleClose = () => {
    props.onClose?.();
  };
  if (showFooter) {
    return null;
  }
  return (
    <div className={prefixCls} style={getStyle()}>
      {props.footer || (
        <>
          {props.insertFooter}
          {showCancelBtn ? (
            <Button v-bind="cancelButtonProps" onClick={handleClose} className="mr-2">
              {cancelText}
            </Button>
          ) : null}

          {props.centerFooter}
          {showOkBtn ? (
            <Button
              {...okButtonProps}
              onClick={handleOk}
              type={okType}
              className="mr-2"
              loading={confirmLoading}
            >
              {okText}
            </Button>
          ) : null}

          {props.appendFooter}
        </>
      )}
    </div>
  );
};

export default DrawerFooter;
