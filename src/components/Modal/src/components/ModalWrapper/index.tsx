import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
  useCallback,
} from 'react';
import type { CSSProperties } from 'react';
import { Spin } from 'antd';
import { useMount, useUnmount, useMemoizedFn } from 'ahooks';
import { useWindowSizeFn } from '/@/hooks/event/useWindowSizeFn';
import { ScrollContainer } from '/@/components/Container';
import { useAppContainer } from '/@/hooks/core/useAppContext';

interface ModalWrapperProp {
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

const ModalWrapper: React.FC<ModalWrapperProp> = (props, ref) => {
  const {
    height,
    fullScreen,
    onExtHeight,
    onHeightChange,
    children,
    loading,
    loadingTip,
    useWrapper = true,
    modalHeaderHeight = 57,
    modalFooterHeight = 74,
    minHeight = 200,
    footerOffset = 0,
  } = props;
  const { saveApp } = useAppContainer();
  const wrapperRef = useRef<any>(null);
  const spinRef = useRef<ElRef>(null);
  const [realHeight, setRealHeight] = useState(0);
  const [minRealHeight, setMinRealHeight] = useState(0);

  const stopElResizeFn: Fn = () => {};

  const setModalHeight = useMemoizedFn(async () => {
    // 解决在弹窗关闭的时候监听还存在,导致再次打开弹窗没有高度
    // 加上这个,就必须在使用的时候传递父级的visible
    if (!props.visible) return;

    let realHeights = 0;
    const wrapperRefDom = wrapperRef.current;
    if (!wrapperRefDom) return;

    const bodyDom = wrapperRefDom.$el.parentElement;
    if (!bodyDom) return;
    bodyDom.style.padding = '0';

    try {
      const modalDom = bodyDom.parentElement && bodyDom.parentElement.parentElement;
      if (!modalDom) return;

      const modalRect = getComputedStyle(modalDom as Element).top;
      const modalTop = Number.parseInt(modalRect, 10);
      let maxHeight =
        window.innerHeight -
        modalTop * 2 +
        (footerOffset! || 0) -
        modalFooterHeight -
        modalHeaderHeight;

      // 距离顶部过进会出现滚动条
      if (modalTop < 40) {
        maxHeight -= 26;
      }
      const spinEl = spinRef.current;

      if (!spinEl) return;
      // if (!realHeights) {
      realHeights = spinEl.scrollHeight;
      // }

      if (fullScreen) {
        setRealHeight(window.innerHeight - modalFooterHeight - modalHeaderHeight - 28);
      } else {
        setRealHeight(height || realHeights > maxHeight ? maxHeight : realHeights);
      }
      onHeightChange && onHeightChange(realHeight);
    } catch (error) {
      console.log(error);
    }
  });

  const scrollTop = useCallback(async () => {
    const wrapperRefDom = wrapperRef.current;
    if (!wrapperRefDom) return;
    (wrapperRefDom as any)?.scrollTo?.(0);
  }, []);

  useImperativeHandle(ref, () => ({
    scrollTop,
  }));

  useWindowSizeFn(setModalHeight.bind(null, false));

  // useMutationObserver(
  //   spinRef,
  //   () => {
  //     setModalHeight();
  //   },
  //   {
  //     attributes: true,
  //     subtree: true,
  //   },
  // );

  useEffect(() => {
    setModalHeight();
    if (!fullScreen) {
      setRealHeight(minRealHeight);
    } else {
      setMinRealHeight(realHeight);
    }
  }, [fullScreen, minRealHeight, realHeight, setMinRealHeight, setModalHeight, setRealHeight]);

  useEffect(() => {
    useWrapper && setModalHeight();
  }, [setModalHeight, useWrapper]);

  const spinStyle = useMemo((): CSSProperties => {
    return {
      minHeight: `${minHeight}px`,
      [fullScreen ? 'height' : 'maxHeight']: `${realHeight}px`,
    };
  }, [fullScreen, minHeight, realHeight]);

  useMount(() => {
    saveApp({
      redoModalHeight: setModalHeight,
    });
    onExtHeight && onExtHeight(modalHeaderHeight + modalFooterHeight);
  });

  useUnmount(() => {
    stopElResizeFn && stopElResizeFn();
  });

  return (
    <ScrollContainer ref={wrapperRef}>
      <div ref={spinRef} style={spinStyle}>
        <Spin spinning={loading} tip={loadingTip}>
          {children}
        </Spin>
      </div>
    </ScrollContainer>
  );
};

export default React.forwardRef(ModalWrapper);
