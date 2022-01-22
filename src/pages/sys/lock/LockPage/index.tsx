import React, { useCallback, useState } from 'react';
import { Input, Button } from 'antd';
import classNames from 'classnames';
import { useNow, useUnLock } from '../useLock';
import { actions, useStoreState } from '/@/store';
import { useDesign } from '/@/hooks/web/useDesign';
import { logout } from '/@/pages/sys/login/useLogin';
import { LockOutlined } from '@ant-design/icons';
import headerImg from '/@/assets/images/header.jpg';
import { CSSTransition } from 'react-transition-group';

import './index.less';

const InputPassword = Input.Password;

const lockSctions = actions.lock;

const LockPage = () => {
  const userState = useStoreState('user');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const [showDate, setShowDate] = useState(true);

  const { prefixCls } = useDesign('lock-page');
  const unLocks = useUnLock();

  const { hour, month, minute, meridiem, year, day, week } = useNow(true);

  const userinfo = userState.userInfo || {};


  /**
   * @description: unLock
   */
  const unLock = useCallback(async () => {
    if (!password) {
      return;
    }
    try {
      setLoading(true);
      const res = await unLocks(password);
      setErrMsg(!res);
    } finally {
      setLoading(false);
    }
  }, [password, unLocks]);

  const goLogin = () => {
    logout();
    lockSctions.resetLockInfo();
  };

  const handleShowForm = (show = false) => {
    setShowDate(show);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div
      className={classNames(
        prefixCls,
        'fixed inset-0 flex h-screen w-screen bg-black items-center justify-center',
      )}
    >
      {showDate ? (
        <div
          className={classNames(
            `${prefixCls}__unlock`,
            'absolute top-0 left-1/2 flex pt-5 h-16 items-center justify-center sm:text-md xl:text-xl text-white flex-col cursor-pointer transform translate-x-1/2',
          )}
          onClick={() => {
            handleShowForm(false);
          }}
        >
          <LockOutlined />
          <span>点击解锁</span>
        </div>
      ) : null}
      <div className="flex w-screen h-screen justify-center items-center">
        <div
          className={classNames(
            `${prefixCls}__hour`,
            'relative mr-5 md:mr-20 w-2/5 h-2/5 md:h-4/5',
          )}
        >
          <span>{hour}</span>
          {showDate ? (
            <span className="meridiem absolute left-5 top-5 text-md xl:text-xl">{meridiem}</span>
          ) : null}
        </div>
        <div className={`${prefixCls}__minute w-2/5 h-2/5 md:h-4/5 `}>
          <span> {minute}</span>
        </div>
      </div>
      <CSSTransition in={!showDate} timeout={300} classNames="fade-slide" unmountOnExit>
        <div className={`${prefixCls}-entry`}>
          <div className={`${prefixCls}-entry-content`}>
            <div className={`${prefixCls}-entry__header enter-x`}>
              <img
                src={userinfo.avatar || headerImg}
                className={`${prefixCls}-entry__header-img`}
              />
              <p className={`${prefixCls}-entry__header-name`}>{userinfo.realName}</p>
            </div>
            <InputPassword
              placeholder="请输入锁屏密码或者用户密码"
              className="enter-x"
              onChange={onPasswordChange}
              value={password}
            />
            {errMsg ? (
              <span className={`${prefixCls}-entry__err-msg enter-x`}>锁屏密码错误</span>
            ) : null}

            <div className={`${prefixCls}-entry__footer enter-x`}>
              <Button
                type="link"
                size="small"
                className="mt-2 mr-2 enter-x"
                disabled={loading}
                onClick={() => {
                  handleShowForm(true);
                }}
              >
                返回
              </Button>
              <Button
                type="link"
                size="small"
                className="mt-2 mr-2 enter-x"
                disabled={loading}
                onClick={goLogin}
              >
                返回登录
              </Button>
              <Button className="mt-2" type="link" size="small" onClick={unLock} disabled={loading}>
                进入系统
              </Button>
            </div>
          </div>
        </div>
      </CSSTransition>
      <div className="absolute bottom-5 w-full text-gray-300 xl:text-xl 2xl:text-3xl text-center enter-y">
        {!showDate ? (
          <div className="text-5xl mb-4 enter-x">
            {hour}:{minute} <span className="text-3xl">{meridiem}</span>
          </div>
        ) : null}
        <div className="text-2xl">
          {year}/{month}/{day} {week}
        </div>
      </div>
    </div>
  );
};

export default LockPage;
