import React from 'react';
import { useHistory } from 'react-router-dom';
import { getGlobSetting } from '/@/hooks/setting';
import { useDesign } from '/@/hooks/web/useDesign';
import { useStoreState } from '/@/store';
import classnames from 'classnames';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import logo from '/@/assets/images/logo.png';
import { PageEnum } from '/@/enums/pageEnum';
import './index.less';

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

const AppLogo: React.FC<AppLogoProp> = (props) => {
  const { theme, showTitle = true, alwaysShowTitle } = props;
  const { prefixCls } = useDesign('app-logo');
  const history = useHistory();
  const { getCollapsedShowTitle } = useMenuSetting();
  const userState = useStoreState('user');
  const { title } = getGlobSetting();
  const appLogoClass = classnames('anticon', prefixCls, theme, {
    'collapsed-show-title': getCollapsedShowTitle(),
  });
  const titleClass = classnames('ml-2 truncate md:opacity-100', `${prefixCls}__title`, {
    'xs:opacity-0': !alwaysShowTitle,
  });
  const goHome = () => {
    history.push(userState.userInfo?.homePath || PageEnum.BASE_HOME);
  };
  return (
    <div className={appLogoClass} onClick={goHome}>
      <img src={logo} />
      {showTitle ? <div className={titleClass}>{title}</div> : null}
    </div>
  );
};

export default AppLogo;
