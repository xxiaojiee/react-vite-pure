import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import Modal from './components/Modal';
import ModalWrapper from './components/ModalWrapper.vue';
import ModalClose from './components/ModalClose.vue';
import ModalFooter from './components/ModalFooter.vue';
import ModalHeader from './components/ModalHeader.vue';
import { isFunction } from '/@/utils/is';
import { deepMerge } from '/@/utils';
import { BasicProps } from './props';
import { useFullScreen } from './hooks/useModalFullScreen';
import { omit } from 'lodash-es';
import { useDesign } from '/@/hooks/web/useDesign';
import type { ModalProps, ModalMethods } from './typing';

const BasicModal: React.FC<BasicProps> = (props) => {
  const {
    visible,
    defaultFullscreen,
    scrollTop = true,
    draggable = true,
    cancelText = '取消',
    okText = '确认',
    canFullscreen = true,
    wrapperFooterOffset = 0,
    useWrapper = true,
    showCancelBtn = true,
    showOkBtn = true,
    closable = true,
    mask = true,
    maskClosable = true,
    keyboard = true,
    okType = 'primary',
    onVisibleVhange,
    onUpdateVisible,
    onRegister = () => {},
    closeFunc,
    onCancel,
    onOk,
    onHeightChange,
  } = props;
  const [isShow, setIsShow] = useState(false);
  // modal   Bottom and top height
  const [extHeight, setExtHeight] = useState(0);
  const [propsRef, setPropsRef] = useState<Partial<ModalProps> | null>(null);
  const modalWrapperRef = useRef<any>(null);
  const { prefixCls } = useDesign('basic-modal');

  // Custom title component: get title
  const getMergeProps = useMemo((): Recordable => {
    return {
      ...props,
      ...propsRef,
    };
  }, [props, propsRef]);

  const { handleFullScreen, getWrapClassName, fullScreen, setFullScreen } = useFullScreen({
    wrapClassName: getMergeProps.wrapClassName,
  });

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

  onRegister(modalMethods);

  // modal component does not need title and origin buttons
  const getProps = useMemo((): Recordable => {
    const opt = {
      ...getMergeProps,
      visible: isShow,
      okButtonProps: undefined,
      cancelButtonProps: undefined,
      title: undefined,
    };
    return {
      ...opt,
      wrapClassName: getWrapClassName,
    };
  }, [getMergeProps, getWrapClassName, isShow]);

  const getBindValue = useMemo((): Recordable => {
    const attr = {
      ...getMergeProps,
      visible: isShow,
      wrapClassName: getWrapClassName,
    };
    if (fullScreen) {
      return omit(attr, ['height', 'title']);
    }
    return omit(attr, 'title');
  }, [fullScreen, getMergeProps, getWrapClassName, isShow]);

  const getWrapperHeight = useMemo(() => {
    if (fullScreen) return undefined;
    return getProps.height;
  }, [fullScreen, getProps.height]);

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
    async (e: Event) => {
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

  const handleOk = useCallback(
    (e: Event) => {
      onOk && onOk(e);
    },
    [onOk],
  );

  const handleHeightChange = useCallback(
    (height: string) => {
      onHeightChange && onHeightChange(height);
    },
    [onHeightChange],
  );

  const handleExtHeight = (height: number) => {
    setExtHeight(height);
  };

  const handleTitleDbClick = useCallback(
    (e) => {
      if (!canFullscreen) return;
      e.stopPropagation();
      handleFullScreen(e);
    },
    [canFullscreen, handleFullScreen],
  );
  return <div>BasicModal</div>;
};

export default BasicModal;
