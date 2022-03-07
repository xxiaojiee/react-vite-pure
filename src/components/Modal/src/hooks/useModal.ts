
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useUnmount } from 'ahooks';
import type {
  UseModalReturnType,
  ModalMethods,
  ModalProps,
  ReturnMethods,
  UseModalInnerReturnType,
} from '../typing';
import { isProdMode } from '/@/utils/env';
import { isFunction } from '/@/utils/is';
import { isEqual } from 'lodash-es';
import { error } from '/@/utils/log';

/**
 * @description: Applicable to independent modal and call outside
 */
export function useModal(): UseModalReturnType {
  const modal = useRef<Nullable<ModalMethods>>(null);
  const loaded = useRef<Nullable<boolean>>(false);
  const dataTransfer = useRef<any>(null);

  const [visible, setVisible] = useState(false);

  useUnmount(() => {
    modal.current = null;
    loaded.current = false;
    dataTransfer.current = null;
  });

  const getInstance = () => {
    const instance = modal.current;
    if (!instance) {
      error('useModal instance is undefined!');
    }
    return instance;
  };

  const register = useCallback((modalMethod: ModalMethods) => {
    if (loaded.current && modalMethod === modal.current) return;
    modal.current = modalMethod;
    loaded.current = true;
    modalMethod.emitVisible = (vis: boolean) => {
      setVisible(vis)
    };
  }, [])

  const methods: ReturnMethods = useMemo(() => ({
    setModalProps: (props: Partial<ModalProps>): void => {
      getInstance()?.setModalProps(props);
    },

    getVisible: visible,

    redoModalHeight: () => {
      getInstance()?.redoModalHeight?.();
    },

    openModal: <T = any>(vis = true, data?: T, openOnSet = true): void => {
      console.log(888888888, vis, getInstance())
      getInstance()?.setModalProps({
        visible: vis,
      });

      if (!data) return;
      if (openOnSet) {
        dataTransfer.current = data;
        return;
      }
      const equal = isEqual(dataTransfer.current, data);
      if (!equal) {
        dataTransfer.current = data;
      }
    },

    closeModal: () => {
      getInstance()?.setModalProps({ visible: false });
    },
  }), [visible]);
  return [register, methods];
}

export const useModalInner = (props, callbackFn?: Fn): UseModalInnerReturnType => {
  console.log('props:', props);
  // const dataTransfer = useRef<any>(null);

  // const [visible] = useState(false);

  const modalInstanceRef = useRef<Nullable<ModalMethods>>(null);


  const getInstance = () => {
    const instance = modalInstanceRef.current;
    if (!instance) {
      error('useModalInner instance is undefined!');
    }
    return instance;
  };

  useUnmount(() => {
    modalInstanceRef.current = null;
  });

  const register = (modalInstance: ModalMethods) => {
    if (modalInstanceRef.current && modalInstanceRef.current === modalInstance) {
      return;
    }
    modalInstanceRef.current = modalInstance;
    props?.onRegister(modalInstance);
  };

  // useEffect(() => {
  //   const data = dataTransfer.current;
  //   if (!data) return;
  //   if (!callbackFn || !isFunction(callbackFn)) return;
  //   callbackFn(data);
  // }, [callbackFn])

  return [
    register,
    {
      changeLoading: (loading = true) => {
        getInstance()?.setModalProps({ loading });
      },
      // getVisible: visible,

      changeOkLoading: (loading = true) => {
        getInstance()?.setModalProps({ confirmLoading: loading });
      },

      closeModal: () => {
        getInstance()?.setModalProps({ visible: false });
      },

      setModalProps: (propObj: Partial<ModalProps>) => {
        getInstance()?.setModalProps(propObj);
      },

      redoModalHeight: () => {
        const callRedo = getInstance()?.redoModalHeight;
        callRedo && callRedo();
      },
    },
  ];
};
