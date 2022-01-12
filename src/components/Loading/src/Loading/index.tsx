import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Spin } from 'antd';
import classNames from 'classnames';
import { ThemeEnum } from '/@/enums/appEnum';
import type { LoadingProps } from '../typing';
import { SizeEnum } from '/@/enums/sizeEnum';
import './index.less';

export interface PortalRef {
  setTips: (val: string) => void;
  setLoading: (val: boolean) => void;
  getLoading: () => void;
}

const Loading = forwardRef<PortalRef, LoadingProps>((props, ref) => {
  const {
    tip = '',
    size = SizeEnum.LARGE,
    absolute = false,
    loading = false,
    background,
    theme = ThemeEnum.LIGHT,
    ...spinProps
  } = props!;
  const [load, setLoad] = useState<boolean>(loading);
  const [tips, setTips] = useState<string>(tip);
  useEffect(() => {
    setLoad(loading);
  }, [loading]);
  useEffect(() => {
    setTips(tip);
  }, [tip]);
  useImperativeHandle(ref, () => ({
    setTips: (val) => {
      setTips(val);
    },
    setLoading: (val) => {
      setLoad(val);
    },
    getLoading: () => {
      return load;
    },
  }));
  if (!load) {
    return null;
  }
  return (
    <section
      className={classNames('full-loading', { absolute, [theme]: !!theme })}
      style={background ? { backgroundColor: background } : {}}
    >
      <Spin {...spinProps} tip={tips} size={size} spinning={load} />
    </section>
  );
});

export default Loading;
