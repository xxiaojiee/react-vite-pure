import React, { useCallback, useMemo } from 'react';
import { Dropdown, Menu } from 'antd';
import classNames from 'classnames';
import { confirmLoginOut } from '/@/pages/sys/login/useLogin';
import { DOC_URL } from '/@/settings/siteSetting';
import { load } from '/@/router/constant';

import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';

import { useDesign } from '/@/hooks/web/useDesign';
import { useModal } from '/@/components/Modal';
import { useStoreState } from '/@/store';

import headerImg from '/@/assets/images/header.jpg';

import { openWindow } from '/@/utils';

import './index.less';

const MenuItem = load(() => import('./DropMenuItem'));
const LockAction = load(() => import('../lock/LockModal'));
const MenuDivider = Menu.Divider;

interface UserDropdownProp {
  theme: 'dark' | 'light';
}

const UserDropdown: React.FC<UserDropdownProp> = (props) => {
  const { theme } = props;
  const userState = useStoreState('user');
  const { prefixCls } = useDesign('header-user-dropdown');

  const { showDoc, useLockPage } = useHeaderSetting();
  const getUserInfo = useMemo(() => {
    const { realName = '', avatar, desc } = userState.userInfo || {};
    return { realName, avatar: avatar || headerImg, desc };
  }, [userState.userInfo]);

  const [register, { openModal }] = useModal();

  const handleMenuClick = useCallback(
    (e: any) => {
      switch (e.key) {
        case 'logout':
          confirmLoginOut();
          break;
        case 'doc':
          openWindow(DOC_URL);
          break;
        case 'lock':
          openModal(true);
          break;
        default:
          break;
      }
    },
    [openModal],
  );
  return (
    <>
      <Dropdown
        placement="bottomLeft"
        overlayClassName={`${prefixCls}-dropdown-overlay`}
        overlay={
          <Menu onClick={handleMenuClick}>
            {showDoc ? (
              <MenuItem eventKey="doc" text="文档" icon="ion:document-text-outline" />
            ) : null}
            {showDoc ? <MenuDivider /> : null}
            {useLockPage ? (
              <MenuItem eventKey="lock" text="锁定屏幕" icon="ion:lock-closed-outline" />
            ) : null}
            <MenuItem eventKey="logout" text="退出系统" icon="ion:power-outline" />
          </Menu>
        }
      >
        <span className={classNames(prefixCls, `${prefixCls}--${theme} flex`)}>
          <img className={`${prefixCls}__header`} src={getUserInfo.avatar} />
          <span className={`${prefixCls}__info hidden md:block`}>
            <span className={`${prefixCls}__name  truncate`}>{getUserInfo.realName}</span>
          </span>
        </span>
      </Dropdown>
      <LockAction onRegister={register} />
    </>
  );
};

export default UserDropdown;
