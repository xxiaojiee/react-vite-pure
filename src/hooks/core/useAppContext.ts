// import { useImmer } from 'use-immer';
import { createContainer } from 'unstated-next';
import { useState } from 'react';
import type { RouterRenderProp } from '/@/router/types';
import { prefixCls } from '/@/settings/designSetting';
import { createLoading } from '/@/components/Loading/src/createLoading';
import type { LoadProps } from '/@/components/Loading/src/createLoading';


export interface initAppContainerProp {
  prefixCls: string;
  isMobile: boolean;
  loading: LoadProps;
  redoModalHeight: () => void;
  [index: string]: any;
}
export type AppContainerProp = RouterRenderProp & initAppContainerProp;


export const useApp = (routerProps: RouterRenderProp) => {
  const [app, setApp] = useState<AppContainerProp>({
    prefixCls,
    isMobile: false,
    loading: createLoading({
      loading: false,
    }),
  } as any);
  const saveApp = (apps: Partial<AppContainerProp>) => {
    setApp((state) => {
      return {
        ...state,
        ...apps,
      }
    });
  };
  return { ...app, ...routerProps, saveApp };
};

const App = createContainer(useApp);

export const AppProvider = App.Provider;
export const useAppContainer = App.useContainer;
