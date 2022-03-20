import { useCallback, useRef, useEffect } from 'react';
import { useDispatch } from "react-redux"
import { actions, useStoreState } from '/@/store';
import { useThrottleFn } from 'ahooks';

import { useRootSetting } from '../setting/useRootSetting';

const lockActions = actions.lock

export function useLockPage() {
  const dispatch = useDispatch();
  const { lockTime } = useRootSetting();
  const userState = useStoreState('user');
  const appState = useStoreState('app');
  const timeId = useRef<TimeoutHandle | null>(null);
  const { token } = userState;
  function clear(): void {
    if (timeId.current) {
      window.clearTimeout(timeId.current);
    }
  }

  const lockPage = useCallback((): void => {
    dispatch(lockActions.setLockInfo({
      isLock: true,
      pwd: undefined,
    }))
  }, [dispatch])

  const resetCalcLockTimeout = useCallback((): void => {
    // not login
    if (!token) {
      clear();
      return;
    }
    if (!lockTime || lockTime < 1) {
      clear();
      return;
    }
    clear();

    timeId.current = setTimeout(() => {
      lockPage();
    }, lockTime * 60 * 1000);

  }, [lockPage, lockTime, token])

  useEffect(() => {
    if (token) {
      resetCalcLockTimeout();
    } else {
      clear();
    }
    return () => {
      console.log('已卸载定时器')
      clear();
    }
  }, [token, resetCalcLockTimeout]);

  // useUnmount(() => {
  //   clear();
  // });

  const { run } = useThrottleFn(() => {
    resetCalcLockTimeout();
  }, { wait: 2000 });

  return () => {
    if (lockTime) {
      return { onKeyup: run, onMousemove: run };
    } else {
      clear();
      return {};
    }
  };
}
