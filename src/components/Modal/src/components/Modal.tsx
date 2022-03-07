import React from 'react';
import { Modal } from 'antd';
import { BasicProps } from '../props';
import { useModalDragMove } from '../hooks/useModalDrag';

const ModalMain: React.FC<BasicProps> = (props) => {
  // const {
  //   scrollTop= true,
  //   draggable = true,
  //   cancelText ='取消',
  //   okText = '确认',
  //   canFullscreen = true,
  //   wrapperFooterOffset=0,
  //   useWrapper = true,
  //   showCancelBtn = true,
  //   showOkBtn = true,
  //   closable = true,
  //   mask = true,
  //   maskClosable= true,
  //   keyboard =true,
  //   okType = 'primary',
  // } = props;
  const {
    className,
    visible,
    destroyOnClose,
    draggable = true,
    cancelText = '取消',
    okText = '确认',
    closable = true,
    mask = true,
    maskClosable = true,
    keyboard = true,
    okType = 'primary',
    children,
    ...otherProps
  } = props;

  useModalDragMove({
    visible,
    destroyOnClose,
    draggable,
  });

  const propsData = {
    visible,
    draggable,
    cancelText,
    okText,
    closable,
    mask,
    maskClosable,
    keyboard,
    okType,
    destroyOnClose,
    ...otherProps,
  };
  return (
    <Modal {...propsData} className={className}>
      {children}
    </Modal>
  );
};

export default ModalMain;
