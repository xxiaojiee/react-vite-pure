import { useEffect, useRef } from 'react';
import type {
  UseDrawerReturnType,
  DrawerInstance,
  ReturnMethods,
  DrawerProps,
  UseDrawerInnerReturnType,
} from './typing';
import { isFunction } from '/@/utils/is';
import { isEqual } from 'lodash-es';
import { error } from '/@/utils/log';
import { useUnmount } from 'ahooks';

/**
 * @description: Applicable to separate drawer and call outside
 */
export function useDrawer(): UseDrawerReturnType {
  const drawer = useRef<DrawerInstance | null>(null);
  const loaded = useRef<Nullable<boolean>>(false);
  const visible = useRef<boolean>(false);
  const dataTransferRef = useRef<any>(null);
  useUnmount(() => {
    drawer.current = null;
    loaded.current = false;
    dataTransferRef.current = null;
  })
  function register(drawerInstance: DrawerInstance) {
    if (loaded.current && drawer.current === drawerInstance) {
      return;
    }
    drawer.current = drawerInstance;
    loaded.current = true;
    drawerInstance.emitVisible = (isShow: boolean) => {
      visible.current = isShow
    };
  }

  const getInstance = () => {
    const instance = drawer.current;
    if (!instance) {
      error('useDrawer instance is undefined!');
    }
    return instance;
  };

  const methods: ReturnMethods = {
    setDrawerProps: (props: Partial<DrawerProps>): void => {
      getInstance()?.setDrawerProps(props);
    },

    getVisible: (): boolean => {
      return visible.current;
    },

    openDrawer: <T = any>(isShow = true, data?: T, openOnSet = true): void => {
      getInstance()?.setDrawerProps({
        visible: isShow,
      });
      if (!data) return;

      if (openOnSet) {
        dataTransferRef.current = data;
        return;
      }
      const equal = isEqual(dataTransferRef.current, data);
      if (!equal) {
        dataTransferRef.current = data;
      }
    },
    closeDrawer: () => {
      getInstance()?.setDrawerProps({ visible: false });
    },
  };

  return [register, methods];
}

export const useDrawerInner = (callbackFn?: Fn): UseDrawerInnerReturnType => {
  const drawerInstanceRef = useRef<Nullable<DrawerInstance>>(null);
  const visible = useRef<boolean>(false);
  const dataTransferRef = useRef<any>(null);
  useUnmount(() => {
    drawerInstanceRef.current = null;
  })


  const getInstance = () => {
    const instance = drawerInstanceRef.current;
    if (!instance) {
      error('useDrawerInner instance is undefined!');
      return;
    }
    return instance;
  };

  const register = (modalInstance: DrawerInstance) => {
    drawerInstanceRef.current = modalInstance;
  };

  useEffect(() => {
    const data = dataTransferRef.current;
    if (!data) return;
    if (!callbackFn || !isFunction(callbackFn)) return;
    callbackFn(data);
  }, [callbackFn]);

  const methods = {
    changeLoading: (loading = true) => {
      getInstance()?.setDrawerProps({ loading });
    },

    changeOkLoading: (loading = true) => {
      getInstance()?.setDrawerProps({ confirmLoading: loading });
    },
    getVisible: (): boolean => {
      return visible.current
    },

    closeDrawer: () => {
      getInstance()?.setDrawerProps({ visible: false });
    },

    setDrawerProps: (props: Partial<DrawerProps>) => {
      getInstance()?.setDrawerProps(props);
    },
  }

  return [
    register,
    methods,
  ];
};
