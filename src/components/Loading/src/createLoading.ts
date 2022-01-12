import React, { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import type { LoadingProps } from './typing';
import Loading from './Loading';
import type { PortalRef } from './Loading';

function getPopupContainer() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return div;
};

export interface LoadProps {
  Vm: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  close: () => void;
  open: () => void;
  setTip: (tip: string) => void;
  setLoading: (loading: boolean) => void;
  readonly loading: boolean | undefined;
  readonly $el: PortalRef;
}

export function createLoading(props?: LoadingProps, target: HTMLElement = getPopupContainer()): loadProps {
  const loadingRef = React.createRef<PortalRef>();
  const data: LoadingProps = {
    tip: '',
    loading: true,
    ...props,
  };

  const Vm: React.ReactElement = createElement(Loading, { ref: loadingRef, ...data });

  function close() {
    unmountComponentAtNode(target);
  }

  function open() {
    render(Vm, target)
  }

  return {
    Vm,
    close,
    open,
    setTip: (tip: string) => {
      loadingRef.current?.setTips(tip);
    },
    setLoading: (loading: boolean) => {
      loadingRef.current?.setLoading(loading);
    },
    get loading() {
      loadingRef.current?.getLoading();
      return data.loading;
    },
    get $el() {
      return loadingRef.current as PortalRef;
    },
  };
}
