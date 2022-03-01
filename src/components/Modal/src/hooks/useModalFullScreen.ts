import { useState, useMemo } from 'react';

export interface UseFullScreenContext {
  wrapClassName: string | undefined;
  modalWrapperRef?: ComponentRef;
  extHeightRef?: number;
}

export function useFullScreen(context: UseFullScreenContext) {
  // const formerHeightRef = ref(0);
  const [fullScreen, setFullScreen] = useState(false);

  const getWrapClassName = useMemo(() => {
    const clsName = context.wrapClassName || '';
    return fullScreen ? `fullscreen-modal ${clsName} ` : clsName;
  }, [context.wrapClassName, fullScreen]);

  const handleFullScreen = (e: any) => {
    e && e.stopPropagation();
    setFullScreen((preState) => !preState)
    // const modalWrapper = unref(context.modalWrapperRef);

    // if (!modalWrapper) return;

    // const wrapperEl = modalWrapper.$el as HTMLElement;
    // if (!wrapperEl) return;
    // const modalWrapSpinEl = wrapperEl.querySelector('.ant-spin-nested-loading') as HTMLElement;

    // if (!modalWrapSpinEl) return;

    // if (!unref(formerHeightRef) && unref(fullScreen)) {
    //   formerHeightRef.value = modalWrapSpinEl.offsetHeight;
    // }

    // if (unref(fullScreen)) {
    //   modalWrapSpinEl.style.height = `${window.innerHeight - unref(context.extHeightRef)}px`;
    // } else {
    //   modalWrapSpinEl.style.height = `${unref(formerHeightRef)}px`;
    // }
  }
  return { getWrapClassName, handleFullScreen, fullScreen, setFullScreen };
}
