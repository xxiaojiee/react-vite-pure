import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';
import HeaderDropdown from '../HeaderDropdown';
import avatar from '/@/assets/logo.svg';
import { useUserContainer } from '/@/contexts/user';

const AvatarDropdown = ({ menu }: { menu?: boolean }) => {
  const { user } = useUserContainer();
  // console.log('user:', user);
  const history = useHistory();
  const onMenuClick = (event: {
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
  }) => {
    const { key } = event;
    if (key === 'logout') {
      return;
    }

    if (key === 'settings') {
      history.push('/settings');

      return;
    }

    history.push(`/auth/${key}`);
  };

  const menuHeaderDropdown = (
    <Menu
      style={
        {
          // '.anticon': {
          //   marginRight: '8px',
          // },
          // '.ant-dropdown-menu-item': {
          //   minWidth: '160px',
          // },
        }
      }
      selectedKeys={[]}
      onClick={onMenuClick}
    >
      {menu && (
        <>
          <Menu.Item key="settings">
            <SettingOutlined />
            个人设置
          </Menu.Item>
          <Menu.Divider />
        </>
      )}

      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return user?.name ? (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          padding: '0 12px',
          cursor: 'pointer',
          transition: 'all 0.3s',
          color: 'rgba(0, 0, 0, 0.85)',
        }}
      >
        <Avatar
          size="small"
          style={{
            margin: '20px 0',
            marginRight: 8,
            color: '#1890ff',
            verticalAlign: 'top',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
          }}
          src={avatar}
          alt="avatar"
        />
        <span>{user.name}</span>
      </span>
    </HeaderDropdown>
  ) : (
    <span>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );
};

export default AvatarDropdown;
