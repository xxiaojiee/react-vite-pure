import React from 'react';
import { Spin } from 'antd';
import classNames from 'classnames';
import { ThemeEnum } from '/@/enums/appEnum';
import type { LoadingProps } from '../typing';
import { SizeEnum } from '/@/enums/sizeEnum';
import './index.less';

const Loading: React.FC<LoadingProps> = (props) => {
  const {
    tip = '',
    size = SizeEnum.LARGE,
    absolute = false,
    loading = false,
    background,
    theme = ThemeEnum.LIGHT,
    ...spinProps
  } = props;
  console.log('loading:', loading);
  if (!loading) {
    return null;
  }
  return (
    <section
      className={classNames('full-loading', { absolute, [theme]: !!theme })}
      style={background ? { backgroundColor: background } : {}}
    >
      <Spin {...spinProps} tip={tip} size={size} spinning={loading} />
    </section>
  );
};

export default Loading;
