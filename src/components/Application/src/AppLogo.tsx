import React from 'react';
import { useHistory } from 'react-router-dom'
import { getGlobSetting } from '/@/hooks/setting';
import { useDesign } from '/@/hooks/web/useDesign';
import { actions } from '/@/store';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import logo from '/@/assets/images/logo.png';

const userActions = actions.user;

interface AppLogoProp {
  /**
   * 当前父组件的主题
   */
  theme?: 'light' | 'dark';
  /**
   * 是否显示标题
   */
  showTitle?: boolean;
  /**
   * 当菜单折叠时，是否显示标题
   */
  alwaysShowTitle?: boolean;
}

const AppLogo: React.FC<AppLogoProp> = () => {
  const { prefixCls } = useDesign('app-logo');
  const history = useHistory();
  const { getCollapsedShowTitle } = useMenuSetting();
  return <div>logo</div>;
};

export default AppLogo;
