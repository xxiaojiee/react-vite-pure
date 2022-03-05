
import type { CSSProperties, ReactNode, MouseEvent } from 'react';
import type { ModalWrapperProps } from './typing';
import type { ButtonProps, ButtonType } from 'antd/lib/button';

declare type getContainerFunc = () => HTMLElement;
export interface ModalProps {
  visible: boolean;
  scrollTop?: boolean;
  height: number;
  minHeight: number;
  // open drag
  draggable?: boolean;
  centered: boolean;
  cancelText?: string;
  okText?: string;
  className?: string;
  closeFunc: () => Promise<boolean>;
};

export interface ModalHeaderProp {
  helpMessage?: string | string[];
  title: ReactNode;
}

export interface ModalCloseProp {
  // Can it be full screen
  canFullscreen?: boolean;
  fullScreen: boolean;
  onCancel?: (e?: MouseEvent) => any;
  onFullscreen?: (e?: MouseEvent) => any;
}

export interface ModalFooterProp {
  onOk?: (e?: any) => any;
  onCancel?: (e?: any) => any;
  okText?: ModalProps['okText'];
  cancelText?: ModalProps['cancelText'];
  cancelButtonProps?: ButtonProps;
  okButtonProps?: ButtonProps;
  confirmLoading?: boolean;
  showCancelBtn?: boolean;
  showOkBtn?: boolean;
  okType?: ButtonType;
  insertFooter?: ReactNode;
  centerFooter?: ReactNode;
  appendFooter?: ReactNode;
};


export interface ModalWrapperProp {
  loading?: boolean;
  useWrapper?: boolean;
  modalHeaderHeight?: number;
  modalFooterHeight?: number;
  minHeight?: number;
  height?: number;
  footerOffset?: number;
  visible: boolean;
  fullScreen: boolean;
  loadingTip?: string;
  onExtHeight?: (e: number) => any;
  onHeightChange?: (e: number) => any;
}

export type BasicProps = {
  defaultFullscreen?: boolean;

  // After enabling the wrapper, the bottom can be increased in height
  wrapperFooterOffset?: number;
  // Whether to setting wrapper
  useWrapper?: boolean;
  loading?: boolean;
  loadingTip?: string;

  wrapperProps?: Partial<ModalWrapperProps>;
  bodyStyle?: CSSProperties;
  closable?: boolean;
  closeIcon: ReactNode;
  destroyOnClose?: boolean;
  footer: ReactNode;
  getContainer?: string | HTMLElement | getContainerFunc | false ;
  mask?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  maskStyle?: CSSProperties;
  visible?: boolean;
  width?: string | number;
  wrapClassName?: string;
  zIndex?: number;
  onRegister?: (e?: any) => void;
  onVisibleVhange?: (e?: boolean) => void;
  onUpdateVisible?: (e?: boolean) => void;
  onHeightChange?: (e: number) => void;

} & ModalHeaderProp & ModalFooterProp & ModalProps & ModalCloseProp;
