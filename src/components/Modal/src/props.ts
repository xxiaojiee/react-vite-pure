
import type { CSSProperties, ReactNode, MouseEvent } from 'react';
import type { ModalWrapperProps } from './typing';
import type { ButtonProps, ButtonType } from 'antd/lib/button';


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

export type BasicProps = ModalProps & {
  defaultFullscreen: boolean;
  // Can it be full screen
  canFullscreen?: boolean;
  // After enabling the wrapper, the bottom can be increased in height
  wrapperFooterOffset: number;
  // Warm reminder message
  helpMessage: string | string[];
  // Whether to setting wrapper
  useWrapper?: boolean;
  loading: boolean;
  loadingTip: string;
  /**
   * @description: Show close button
   */
  showCancelBtn?: boolean;
  /**
   * @description: Show confirmation button
   */
  showOkBtn: boolean;

  wrapperProps: Partial<ModalWrapperProps>;

  afterClose: () => Promise<ReactNode>;

  bodyStyle: CSSProperties;

  closable?: boolean;

  closeIcon: ReactNode;

  confirmLoading: boolean;

  destroyOnClose: boolean;

  footer: ReactNode;

  getContainer: () => any;

  mask?: boolean;

  maskClosable?: boolean;
  keyboard?: boolean;

  maskStyle: CSSProperties;

  okType?: ButtonType;

  okButtonProps: ButtonProps;

  cancelButtonProps: ButtonProps;

  title: string;

  visible: boolean;

  width: string | number;

  wrapClassName: string;

  zIndex: number;

  onCancel?: (e?: any) => any;

  onOk?: (e?: any) => any;

  onRegister?: (e?: any) => void;

  onVisibleVhange?: (e?: boolean) => void;

  onUpdateVisible?: (e?: boolean) => void;

  onHeightChange?: (e: string) => void;

  insertFooter?: ReactNode;
  centerFooter?: ReactNode;
  appendFooter?: ReactNode;
};
