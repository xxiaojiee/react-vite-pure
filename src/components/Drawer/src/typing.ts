import type { ButtonProps, ButtonType } from 'antd/lib/button';
import type { CSSProperties, ReactNode } from 'react';
import React from 'react';
import type { ScrollContainerOptions } from '/@/components/Container/index';


declare type getContainerFunc = () => HTMLElement;

export interface DrawerInstance {
  setDrawerProps: (props: Partial<DrawerProps> | boolean) => void;
  emitVisible?: (visible: boolean) => void;
}

export interface ReturnMethods extends DrawerInstance {
  openDrawer: <T = any>(visible?: boolean, data?: T, openOnSet?: boolean) => void;
  closeDrawer: () => void;
  getVisible?: () => boolean;
}

export type RegisterFn = (drawerInstance: DrawerInstance, uuid?: string) => void;

export interface ReturnInnerMethods extends DrawerInstance {
  closeDrawer: () => void;
  changeLoading: (loading: boolean) => void;
  changeOkLoading: (loading: boolean) => void;
  getVisible?: () => boolean;
}

export type UseDrawerReturnType = [RegisterFn, ReturnMethods];

export type UseDrawerInnerReturnType = [RegisterFn, ReturnInnerMethods];

export interface FooterProps {
  confirmLoading: boolean;
  /**
   * @description: Show close button
   */
  showCancelBtn?: boolean;
  cancelButtonProps: Recordable;
  cancelText?: string;
  /**
   * @description: Show confirmation button
   */
  showOkBtn?: boolean;
  okButtonProps: Recordable;
  okText?: string;
  okType?: ButtonType;
  showFooter?: boolean;
  footerHeight?: string | number;
  footer?: React.ReactNode;
  insertFooter?: React.ReactNode;
  centerFooter?: React.ReactNode;
  appendFooter?: React.ReactNode;
};

export interface BasicProps extends FooterProps {
  isDetail: boolean;
  title: string;
  loadingText: string;
  showDetailBack: boolean;
  visible: boolean;
  loading: boolean;
  maskClosable: boolean;
  className?: string;
  getContainer?: string | HTMLElement | getContainerFunc | false;
  closeFunc: () => Promise<any>,
  destroyOnClose: boolean,
  titleToolbar?: React.ReactNode,
  onClose?: (e?: EventType ) => void;
  onOk?: (e?: EventType ) => void;
  handleRegister?: (e: any ) => void;
  onVisibleChange?: (e: boolean ) => void;
};



export interface DrawerFooterProps {
  showOkBtn?: boolean;
  showCancelBtn: boolean;
  /**
   * Text of the Cancel button
   * @default 'cancel'
   * @type string
   */
  cancelText: string;
  /**
   * Text of the OK button
   * @default 'OK'
   * @type string
   */
  okText: string;

  /**
   * Button type of the OK button
   * @default 'primary'
   * @type string
   */
  okType: ButtonType;
  /**
   * The ok button props, follow jsx rules
   * @type object
   */
  okButtonProps: ButtonProps;

  /**
   * The cancel button props, follow jsx rules
   * @type object
   */
  cancelButtonProps: ButtonProps;
  /**
   * Whether to apply loading visual effect for OK button or not
   * @default false
   * @type boolean
   */
  confirmLoading: boolean;

  showFooter: boolean;
  footerHeight: string | number;
}
export interface DrawerProps extends DrawerFooterProps {
  isDetail?: boolean;
  loading?: boolean;
  showDetailBack?: boolean;
  visible?: boolean;
  className?: string;
  /**
   * Built-in ScrollContainer component configuration
   * @type ScrollContainerOptions
   */
  scrollOptions?: ScrollContainerOptions;
  closeFunc?: () => Promise<any>;
  triggerWindowResize?: boolean;
  /**
   * Whether a close (x) button is visible on top right of the Drawer dialog or not.
   * @default true
   * @type boolean
   */
  closable?: boolean;

  /**
   * Whether to unmount child components on closing drawer or not.
   * @default false
   * @type boolean
   */
  destroyOnClose?: boolean;

  /**
   * Return the mounted node for Drawer.
   * @default 'body'
   * @type any ( HTMLElement| () => HTMLElement | string)
   */
   getContainer?: string | HTMLElement | getContainerFunc | false;

  /**
   * Whether to show mask or not.
   * @default true
   * @type boolean
   */
  mask?: boolean;

  /**
   * Clicking on the mask (area outside the Drawer) to close the Drawer or not.
   * @default true
   * @type boolean
   */
  maskClosable?: boolean;

  /**
   * Style for Drawer's mask element.
   * @default {}
   * @type object
   */
  maskStyle?: CSSProperties;

  /**
   * The title for Drawer.
   * @type any (string | slot)
   */
  title?: ReactNode | JSX.Element;
  /**
   * The class name of the container of the Drawer dialog.
   * @type string
   */
  wrapClassName?: string;
  class?: string;
  /**
   * Style of wrapper element which **contains mask** compare to `drawerStyle`
   * @type object
   */
  wrapStyle?: CSSProperties;

  /**
   * Style of the popup layer element
   * @type object
   */
  drawerStyle?: CSSProperties;

  /**
   * Style of floating layer, typically used for adjusting its position.
   * @type object
   */
  bodyStyle?: CSSProperties;
  headerStyle?: CSSProperties;

  /**
   * Width of the Drawer dialog.
   * @default 256
   * @type string | number
   */
  width?: string | number;

  /**
   * placement is top or bottom, height of the Drawer dialog.
   * @type string | number
   */
  height?: string | number;

  /**
   * The z-index of the Drawer.
   * @default 1000
   * @type number
   */
  zIndex?: number;

  /**
   * The placement of the Drawer.
   * @default 'right'
   * @type string
   */
  placement?: 'top' | 'right' | 'bottom' | 'left';
  afterVisibleChange?: (visible?: boolean) => void;
  keyboard?: boolean;
  /**
   * Specify a callback that will be called when a user clicks mask, close button or Cancel button.
   */
  onClose?: (e?: EventType ) => void;
}
export interface DrawerActionType {
  scrollBottom: () => void;
  scrollTo: (to: number) => void;
  getScrollWrap: () => Element | null;
}
