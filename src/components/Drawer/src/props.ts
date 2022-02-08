
export interface footerProps {
  confirmLoading: boolean;
  /**
   * @description: Show close button
   */
  showCancelBtn: boolean;
  cancelButtonProps: Recordable;
  cancelText: string;
  /**
   * @description: Show confirmation button
   */
  showOkBtn: boolean;
  okButtonProps: Recordable;
  okText: string;
  okType: string;
  showFooter: boolean;
  footerHeight: string | number;
};

export interface basicProps extends footerProps {
  isDetail: boolean;
  title: string;
  loadingText: string;
  showDetailBack: boolean;
  visible: boolean;
  loading: boolean;
  maskClosable: boolean;
  getContainer: unknown,
  closeFunc: unknown,
  destroyOnClose: boolean,
};
