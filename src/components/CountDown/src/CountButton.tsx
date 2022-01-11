import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'antd';
import type { ButtonProps } from 'antd';
import { useCountdown } from './useCountdown';
import { isFunction } from '/@/utils/is';

interface CountButtonProps extends ButtonProps {
  count: number;
  beforeStartFunc: () => Promise<boolean>;
}

const CountButton: React.FC<CountButtonProps> = (props) => {
  const { count = 60, beforeStartFunc, ...buttonProps } = props;
  const [loading, setLoading] = useState(false);
  const { currentCount, isStart, start, reset } = useCountdown(count);
  const getButtonText = useMemo(() => {
    return !isStart ? '获取验证码' : `${currentCount}秒后重新获取`;
  }, [isStart, currentCount]);
  useEffect(() => {
    props.value === undefined && reset();
  }, [props.value, reset]);
  /**
   * @description: 执行前判断是否有外部函数，执行后决定是否启动
   */
  const handleStart = useCallback(async () => {
    if (beforeStartFunc && isFunction(beforeStartFunc)) {
      setLoading(true);
      try {
        const canStart = await beforeStartFunc();
        canStart && start();
      } finally {
        setLoading(false);
      }
    } else {
      start();
    }
  }, [beforeStartFunc, start]);
  return (
    <Button {...buttonProps} disabled={isStart} onClick={handleStart} loading={loading}>
      {getButtonText}
    </Button>
  );
};

export default CountButton;
