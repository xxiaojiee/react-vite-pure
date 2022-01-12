import React, { useCallback, useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { zxcvbn, ZxcvbnResult } from '@zxcvbn-ts/core';
import { PasswordProps } from 'antd/lib/input/Password';
import { Input } from 'antd';
import { useDesign } from '/@/hooks/web/useDesign';

import './index.less';

const InputPassword = Input.Password;

interface StrengthMeterProp extends PasswordProps {
  value: string;
  showInput: boolean;
  disabled: boolean;
}

const StrengthMeter: React.FC<StrengthMeterProp> = (props) => {
  const { showInput = true, value = '', disabled, ...passwordProps } = props;
  const { prefixCls } = useDesign('strength-meter');
  const [innerValue, setInnerValue] = useState<string>('');
  const getPasswordStrength = useCallback(() => {
    if (disabled) return -1;
    const score = innerValue ? (zxcvbn(innerValue) as ZxcvbnResult).score : -1;
    return score;
  }, [innerValue, disabled]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInnerValue(e.target.value);
  };

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  return (
    <div className={`${prefixCls} relative`}>
      {showInput ? (
        <InputPassword
          {...passwordProps}
          allowClear
          value={innerValue}
          onChange={handleChange}
          disabled={disabled}
        />
      ) : null}
      {/* 密码强度检测器 */}
      <div className={`${prefixCls}-bar`}>
        <div className={`${prefixCls}-bar--fill`} data-score={getPasswordStrength()} />
      </div>
    </div>
  );
};

export default StrengthMeter;
