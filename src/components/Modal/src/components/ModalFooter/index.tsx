import React from 'react';
import { Button } from 'antd';
import { BasicProps } from '../../props';

const ModalClose: React.FC<BasicProps> = (props) => {
  const {
    onOk,
    onCancel,
    okText = '确认',
    cancelText = '取消',
    okType = 'primary',
    cancelButtonProps,
    okButtonProps,
    confirmLoading,
    showCancelBtn = true,
    showOkBtn = true,
    insertFooter,
    centerFooter,
    appendFooter,
  } = props;
  const handleOk = (e: any) => {
    onOk && onOk(e);
  };

  const handleCancel = (e: any) => {
    onCancel && onCancel(e);
  };
  return (
    <div>
      {insertFooter}
      {showCancelBtn ? (
        <Button {...cancelButtonProps} onClick={handleCancel}>
          {cancelText}
        </Button>
      ) : null}

      {centerFooter}
      {showOkBtn ? (
        <Button {...okButtonProps} type={okType} loading={confirmLoading} onClick={handleOk}>
          {okText}
        </Button>
      ) : null}

      {appendFooter}
    </div>
  );
};

export default ModalClose;
