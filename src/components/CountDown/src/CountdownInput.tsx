import React from 'react';
import { Input } from 'antd';
import type { InputProps } from 'antd';
import CountButton from './CountButton';
import { useDesign } from '/@/hooks/web/useDesign';
import './CountdownInput.less';

interface CountdownInputProps extends InputProps {
  value?: string;
  size?: 'small' | 'middle' | 'large' | undefined;
  count?: number;
  sendCodeApi?: () => Promise<boolean>;
}

const CountdownInput: React.FC<CountdownInputProps> = (props) => {
  const { count = 60, size, sendCodeApi, value, ...inputProps } = props;
  const { prefixCls } = useDesign('countdown-input');
  return (
    <Input
      {...inputProps}
      size={size}
      value={value}
      className={prefixCls}
      addonAfter={
        <CountButton size={size} count={count} value={value} beforeStartFunc={sendCodeApi} />
      }
    />
  );
};

export default CountdownInput;
