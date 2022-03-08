import React from 'react';
import { Button, Form } from 'antd';
import { useDesign } from '/@/hooks/web/useDesign';
import { actions, useStoreState } from '/@/store';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { useDispatch } from 'react-redux';
import { BasicModal, useModalInner } from '/@/components/Modal/index';
// import { BasicForm, useForm } from '/@/components/Form/index';

import headerImg from '/@/assets/images/header.jpg';

import './index.less';

const lockActions = actions.lock;

const LockModal = (props) => {
  const { prefixCls } = useDesign('header-lock-modal');
  const userState = useStoreState('user');
  const formInstance = Form.useForm()[0];
  const dispatch = useDispatch();
  const { avatar = headerImg, realName } = userState.userInfo || {};

  const [register, { closeModal }] = useModalInner(props);

  const handleLock = async () => {
    const values = await formInstance.validateFields();
    const { password } = values;
    closeModal();
    dispatch(
      lockActions.setLockInfo({
        isLock: true,
        pwd: password,
      }),
    );
  };
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
          <p className={`${prefixCls}__header-name`}>{realName}</p>
        </div>

        <ProForm<{
          password: string;
        }>
          form={formInstance}
          submitter={false}
          onKeyDown={(e) => {
            // 回车锁屏
            if (e.key === 'Enter') {
              handleLock();
            }
          }}
        >
          <ProFormText.Password
            rules={[{ required: true, message: '请输入锁屏密码' }]}
            name="password"
            label="锁屏密码"
            placeholder="请输入"
            fieldProps={{
              autoComplete: 'off',
            }}
          />
        </ProForm>

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
