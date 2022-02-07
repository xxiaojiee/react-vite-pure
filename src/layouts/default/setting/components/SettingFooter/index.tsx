import React from 'react';
import { CopyOutlined, RedoOutlined } from '@ant-design/icons';

import { useStoreState, actions } from '/@/store';
import { useDispatch } from 'react-redux'
import { useMultipleTabStore } from '/@/store/modules/multipleTab';

import { useDesign } from '/@/hooks/web/useDesign';
import { getMessage } from '/@/hooks/web/getMessage';
import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';

import { updateColorWeak } from '/@/logics/theme/updateColorWeak';
import { updateGrayMode } from '/@/logics/theme/updateGrayMode';
import defaultSetting from '/@/settings/projectSetting';

const permissionActions = actions.permission
const appActions = actions.app
const userActions = actions.user

const SettingFooter = () => {
  const dispatch = useDispatch();
  const appState = useStoreState('app');
  const copyToClipboard = useCopyToClipboard()
  const { prefixCls } = useDesign('setting-footer');
  const { createSuccessModal, createMessage } = getMessage();
  const tabStore = useMultipleTabStore();

  function handleCopy() {
    const { isSuccessRef } = copyToClipboard(
      JSON.stringify(appState.projectConfig, null, 2),
    );
    isSuccessRef.current &&
      createSuccessModal({
        title: '操作成功',
        content: '复制成功,请到 src/settings/projectSetting.ts 中修改配置！',
      });
  }
  function handleResetSetting() {
    try {
      dispatch(appActions.setProjectConfig(defaultSetting))
      const { colorWeak, grayMode } = defaultSetting;
      // updateTheme(themeColor);
      updateColorWeak(colorWeak);
      updateGrayMode(grayMode);
      createMessage.success('重置成功！');
    } catch (error: any) {
      createMessage.error(error);
    }
  }

  function handleClearAndRedo() {
    localStorage.clear();
    dispatch(appActions.resetAllState())
    dispatch(permissionActions.resetState())
    tabStore.resetState();
    dispatch(userActions.resetState())
    location.reload();
  }
  return <div>SettingFooter</div>;
};

export default SettingFooter;
