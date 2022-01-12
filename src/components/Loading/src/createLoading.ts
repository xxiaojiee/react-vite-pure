import React, { createElement, useRef } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import type { LoadingProps } from './typing';
import Loading from './Loading';

function getPopupContainer() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return div;
};

export function createLoading(props?: LoadingProps, target: HTMLElement = getPopupContainer()) {

  const data: LoadingProps = {
    tip: '',
    loading: true,
    ...props,
  };

  const Vm: React.ReactElement = createElement(Loading, { ...data });


  setTimeout(() => {


  }, 2000);

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
      data.tip = tip;
    },
    setLoading: (loading: boolean) => {
      data.loading = loading;
      console.log(4444444, data.loading);
    },
    get isshow() {
      console.log(66666666666);
      return data.loading;
    },
    get $el() {
      return Vm as React.ReactElement;
    },
  };
}
