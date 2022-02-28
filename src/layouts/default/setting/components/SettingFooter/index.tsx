import React, { useCallback } from 'react';
import { Button } from 'antd';
import { CopyOutlined, RedoOutlined } from '@ant-design/icons';

import { useStoreState, actions } from '/@/store';
import { useDispatch } from 'react-redux';

import { useDesign } from '/@/hooks/web/useDesign';
import { getMessage } from '/@/hooks/web/getMessage';
import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';

import { updateColorWeak } from '/@/logics/theme/updateColorWeak';
import { updateGrayMode } from '/@/logics/theme/updateGrayMode';
import defaultSetting from '/@/settings/projectSetting';

import './index.less';

const permissionActions = actions.permission;
const appActions = actions.app;
const userActions = actions.user;
const multipleTabActions = actions.multipleTab;

const SettingFooter = () => {
  const dispatch = useDispatch();
  const appState = useStoreState('app');
  const copyToClipboard = useCopyToClipboard();
  const { prefixCls } = useDesign('setting-footer');
  const { createSuccessModal, createMessage } = getMessage();

  const handleCopy = () => {
    const { isSuccessRef } = copyToClipboard(JSON.stringify(appState.projectConfig, null, 2));
    isSuccessRef.current &&
      createSuccessModal({
        title: '操作成功',
        content: '复制成功,请到 src/settings/projectSetting.ts 中修改配置！',
      });
  };
  const handleResetSetting = () => {
    try {
      dispatch(appActions.setProjectConfig(defaultSetting));
      const { colorWeak, grayMode } = defaultSetting;
      // updateTheme(themeColor);
      updateColorWeak(colorWeak);
      updateGrayMode(grayMode);
      createMessage.success('重置成功！');
    } catch (error: any) {
      createMessage.error(error);
    }
  };

  const handleClearAndRedo = () => {
    localStorage.clear();
    dispatch(appActions.resetAllState());
    dispatch(permissionActions.resetState());
    dispatch(multipleTabActions.resetState());
    dispatch(userActions.resetState());
    location.reload();
  };
  return (
    <div className={prefixCls}>
      <Button type="primary" block onClick={handleCopy}>
        <CopyOutlined className="mr-2" />
        拷贝
      </Button>

      <Button color="warning" block onClick={handleResetSetting} className="my-3">
        <RedoOutlined className="mr-2" />
        重置
      </Button>

      <Button color="error" block onClick={handleClearAndRedo}>
        <RedoOutlined className="mr-2" />
        清空缓存并返回登录页
      </Button>
    </div>
  );
};

export default SettingFooter;
