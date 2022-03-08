import { useState, useRef } from 'react';
import { useMount, useUnmount } from 'ahooks';
import { actions, useStoreState } from '/@/store';
import { useDispatch } from 'react-redux';
import { useLogin } from '/@/pages/sys/login/useLogin';
import { dateUtil } from '/@/utils/dateUtil';

const lockActions = actions.lock;

export function useNow(immediate = true) {
  let timer = useRef<IntervalHandle | null>(null);
  const [state, setState] = useState({
    year: 0,
    month: 0,
    week: '',
    day: 0,
    hour: '',
    minute: '',
    second: 0,
    meridiem: '',
  })

  const update = () => {
    const now = dateUtil();
    const h = now.format('HH');
    const m = now.format('mm');
    const s = now.get('s');
    const weekNum = ['日', '一', '二', '三', '四', '五', '六'][now.day()]
    setState({
      year: now.get('y'),
      month: now.get('M') + 1,
      week: `星期${weekNum}`,
      day: now.get('date'),
      hour: h,
      minute: m,
      second: s,
      meridiem: now.format('A'),
    })
  };

  function start() {
    update();
    stop();
    timer.current = setInterval(() => update(), 1000);
  }

  function stop() {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null
    }
  }
  useMount(() => {
    immediate && start();
  });

  useUnmount(() => {
    stop();
  });

  return {
    ...state,
    start,
    stop,
  };
}

export function useUnLock() {
  const userState = useStoreState('user');
  const lockState = useStoreState('lock');
  const dispatch = useDispatch();
  const login = useLogin();
  return async function unLock(password?: string) {
    if (lockState.lockInfo?.pwd === password) {
      dispatch(lockActions.resetLockInfo())
      return true;
    }
    const tryLogin = async () => {
      try {
        const username = userState.userInfo?.username;
        const res = await login({
          username,
          password: password!,
          mode: 'none',
        });
        if (res) {
          dispatch(lockActions.resetLockInfo())
        }
        return res;
      } catch (error) {
        return false;
      }
    };
    return await tryLogin();
  }
}

