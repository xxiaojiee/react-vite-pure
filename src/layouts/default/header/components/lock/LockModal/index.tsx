import React, { useMemo } from 'react';
import { Button } from 'antd';
import { useDesign } from '/@/hooks/web/useDesign';
import { actions, useStoreState } from '/@/store';
import { useDispatch } from 'react-redux';
import { BasicModal, useModalInner } from '/@/components/Modal/index';
// import { BasicForm, useForm } from '/@/components/Form/index';

import headerImg from '/@/assets/images/header.jpg';

import './index.less';

const lockActions = actions.lock;

const LockModal = (props) => {
  const { prefixCls } = useDesign('header-lock-modal');
  const userState = useStoreState('user');
  const dispatch = useDispatch();

  const getRealName = userState.getUserInfo?.realName;
  const [register, { closeModal }] = useModalInner(props);

  // const [registerForm, { validateFields, resetFields }] = useForm({
  //   showActionButtonGroup: false,
  //   schemas: [
  //     {
  //       field: 'password',
  //       label: '锁屏密码',
  //       component: 'InputPassword',
  //       required: true,
  //     },
  //   ],
  // });

  const handleLock = async () => {
    // const values = (await validateFields()) as any;
    // const { password } = values;
    // closeModal();
    // dispatch(
    //   lockActions.setLockInfo({
    //     isLock: true,
    //     pwd: password,
    //   }),
    // );
    // await resetFields();
  };

  const avatar = userState.getUserInfo?.avatar || headerImg;

  return (
    <BasicModal
      {...props}
      footer={null}
      title="锁定屏幕"
      className={prefixCls}
      onRegister={register}
    >
      <div className={`${prefixCls}__entry`}>
        <div className={`${prefixCls}__header`}>
          <img src={avatar} className={`${prefixCls}__header-img`} />
          <p className={`${prefixCls}__header-name`}>{getRealName}</p>
        </div>

        <div>表单</div>

        <div className={`${prefixCls}__footer`}>
          <Button type="primary" block className="mt-2" onClick={handleLock}>
            锁定
          </Button>
        </div>
      </div>
    </BasicModal>
  );
};

export default LockModal;
