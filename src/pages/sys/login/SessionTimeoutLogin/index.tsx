import React, { useRef } from 'react';
import Login from '../Login';
import { CSSTransition } from 'react-transition-group';
import { useStoreState } from '/@/store';
import { useMount, useUnmount } from 'ahooks';
import { useDesign } from '/@/hooks/web/useDesign';
import { PermissionModeEnum } from '/@/enums/appEnum';

import './index.less';

const SessionTimeoutLogin = () => {
  const { prefixCls } = useDesign('st-login');
  const userState = useStoreState('user');
  const permissionrState = useStoreState('permission');
  const appState = useStoreState('app');
  const userId = useRef<Nullable<number | string>>(0);

  const isBackMode = () => {
    return appState.projectConfig.permissionMode === PermissionModeEnum.BACK;
  };

  useMount(() => {
    // 记录当前的UserId
    userId.current = userState.uerInfo?.userId;
    console.log('Mounted', userState.uerInfo);
  });

  useUnmount(() => {
    if (userId.current && userId.current !== userState.uerInfo.userId) {
      // 登录的不是同一个用户，刷新整个页面以便丢弃之前用户的页面状态
      document.location.reload();
    } else if (isBackMode() && permissionrState.lastBuildMenuTime === 0) {
      // 后台权限模式下，没有成功加载过菜单，就重新加载整个页面。这通常发生在会话过期后按F5刷新整个页面后载入了本模块这种场景
      document.location.reload();
    }
  });
  return (
    <div className={prefixCls}>
      <Login sessionTimeout />
    </div>
  );
};

export default SessionTimeoutLogin;
