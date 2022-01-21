import React, { createElement, useEffect } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { useMount } from 'ahooks';
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
  status: boolean;
  $el: PortalRef;
}

export function createLoading(props?: LoadingProps, target: HTMLElement = getPopupContainer()): loadProps {
  const loadingRef = React.createRef<PortalRef>();
  const data: LoadingProps = {
    tip: '',
    loading: true,
    ...props,
  };


  function close() {
    unmountComponentAtNode(target);
  }

  function open(loading) {
    if (loadingRef.current) {
      loadingRef.current?.setLoading(true);
      return;
    }
    render(createElement(Loading, { ref: loadingRef, ...data, loading, }), target)
  }

  return {
    close,
    open,
    setTip: (tip: string) => {
      loadingRef.current?.setTips(tip);
    },
    setLoading: (loading: boolean) => {
      if (!loadingRef.current) {
        open(loading)
        return;
      }
      loadingRef.current?.setLoading(loading);
    },
    get isOpen() {
      return !!loadingRef.current;
    },
    get status() {
      return loadingRef.current?.getLoading();
    },
    get $el() {
      return target as HTMLElement;
    },
  };
}
