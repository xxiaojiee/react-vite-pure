import React from 'react';
import { Button } from 'antd';
import { ModalFooterProp } from '../../props';

const ModalFooter: React.FC<ModalFooterProp> = (props) => {
  const {
    onOk = () => {},
    onCancel = () => {},
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
  return (
    <div>
      {insertFooter}
      {showCancelBtn ? (
        <Button {...cancelButtonProps} onClick={onCancel}>
          {cancelText}
        </Button>
      ) : null}

      {centerFooter}
      {showOkBtn ? (
        <Button {...okButtonProps} type={okType} loading={confirmLoading} onClick={onOk}>
          {okText}
        </Button>
      ) : null}

      {appendFooter}
    </div>
  );
};

export default ModalFooter;
