import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import type { MouseEvent } from 'react';
import Modal from './components/Modal';
import ModalWrapper from './components/ModalWrapper';
import ModalClose from './components/ModalClose';
import ModalFooter from './components/ModalFooter';
import ModalHeader from './components/ModalHeader';
import { isFunction, isDef } from '/@/utils/is';
import { BasicProps } from './props';
import { useFullScreen } from './hooks/useModalFullScreen';
import { omit } from 'lodash-es';
import { useDesign } from '/@/hooks/web/useDesign';
import type { ModalProps, ModalMethods } from './typing';

const BasicModal: React.FC<BasicProps> = (props) => {
  const {
    children,
    visible,
    closeIcon,
    footer,
    defaultFullscreen,
    onVisibleVhange,
    onUpdateVisible,
    closeFunc,
    onCancel,
    onOk,
    onHeightChange,
    wrapClassName,
    scrollTop = true,
    wrapperFooterOffset = 0,
    onRegister = () => {},
  } = props;
  const [isShow, setIsShow] = useState(false);
  // modal   Bottom and top height
  const [extHeight, setExtHeight] = useState(0);
  const [propsRef, setPropsRef] = useState<Partial<ModalProps> | null>(null);
  const modalWrapperRef = useRef<any>(null);
  const { prefixCls } = useDesign('basic-modal');

  const { handleFullScreen, getWrapClassName, fullScreen, setFullScreen } = useFullScreen({
    extHeight,
    wrapClassName,
  });

  // Custom title component: get title
  const getProps = useMemo((): BasicProps => {
    return {
      ...props,
      ...propsRef,
      visible: isShow,
      wrapClassName: getWrapClassName,
    };
  }, [props, propsRef, isShow, getWrapClassName]);

  /**
   * @description: 设置modal参数
   */
  const setModalProps = useCallback(
    (params: Partial<ModalProps>): void => {
      // Keep the last setModalProps
      setPropsRef({
        ...propsRef,
        ...params,
      });
      if (Reflect.has(params, 'visible')) {
        setIsShow(!!params.visible);
      }
      if (Reflect.has(params, 'defaultFullscreen')) {
        setFullScreen(!!params.defaultFullscreen);
      }
    },
    [propsRef, setFullScreen],
  );

  const modalMethods = useRef<ModalMethods>({
    setModalProps,
    emitVisible: undefined,
    redoModalHeight: () => {
      (modalWrapperRef.current as any)?.setModalHeight();
    },
  });

  onRegister(modalMethods.current);

  useEffect(() => {
    setIsShow(!!visible);
  }, [visible]);

  useEffect(() => {
    setFullScreen(!!defaultFullscreen);
  }, [defaultFullscreen, setFullScreen]);

  useEffect(() => {
    onVisibleVhange && onVisibleVhange(isShow);
    onUpdateVisible && onUpdateVisible(isShow);
    modalMethods.current.emitVisible?.(isShow);
  }, [isShow, onUpdateVisible, onVisibleVhange]);

  useEffect(() => {
    if (scrollTop && isShow && modalWrapperRef.current) {
      (modalWrapperRef.current as any).scrollTop();
    }
  }, [isShow, scrollTop]);

  // 取消事件
  const handleCancel = useCallback(
    async (e: MouseEvent) => {
      e?.stopPropagation();
      // 过滤自定义关闭按钮的空白区域
      if ((e.target as HTMLElement)?.classList?.contains(`${prefixCls}-close--custom`)) return;
      if (closeFunc && isFunction(closeFunc)) {
        const isClose: boolean = await closeFunc();
        setIsShow(!isClose);
        return;
      }
      setIsShow(false);
      onCancel && onCancel(e);
    },
    [closeFunc, onCancel, prefixCls],
  );

  const handleExtHeight = (height: number) => {
    setExtHeight(height);
  };

  const getCloseIcon = isDef(closeIcon) ? (
    closeIcon
  ) : (
    <ModalClose
      canFullscreen={getProps.canFullscreen}
      fullScreen={fullScreen}
      onCancel={handleCancel}
      onFullscreen={handleFullScreen}
    />
  );
  const getFooter = isDef(footer) ? (
    footer
  ) : (
    <ModalFooter {...omit(getProps, ['style', 'className'])} onOk={onOk} onCancel={handleCancel} />
  );
  return (
    <Modal
      {...getProps}
      onCancel={handleCancel}
      closeIcon={getCloseIcon}
      title={<ModalHeader helpMessage={getProps.helpMessage} title={getProps.title} />}
      footer={getFooter}
    >
      <ModalWrapper
        {...getProps.wrapperProps}
        useWrapper={getProps.useWrapper}
        footerOffset={wrapperFooterOffset}
        fullScreen={fullScreen}
        ref={modalWrapperRef}
        minHeight={getProps.minHeight}
        height={fullScreen ? undefined : getProps.height}
        visible={isShow}
        modalFooterHeight={footer !== undefined && !footer ? 0 : undefined}
        onExtHeight={handleExtHeight}
        onHeightChange={onHeightChange}
      >
        {children}
      </ModalWrapper>
    </Modal>
  );
};

export default BasicModal;
