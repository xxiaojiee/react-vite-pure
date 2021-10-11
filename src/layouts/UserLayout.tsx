import { DefaultFooter, getMenuData, getPageTitle, MenuDataItem } from '@ant-design/pro-layout';
import { Link, useLocation } from 'react-router-dom';
import React from 'react';
import { DocumentTitle } from '/@/components/DocumentTitle';
import proSettings from '/@/common/setting';
import { IRouter } from '/@/common/router';
import logo from '/@/assets/logo.svg';
import { theme } from '/@/common/theme';

export interface UserLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: IRouter;
}

const UserLayout: React.FC<UserLayoutProps> = (props: any) => {
  const { route, children } = props;
  const { routes = [] } = route;
  const location = useLocation();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    ...props,
  });
  // console.log(props);
  return (
    <DocumentTitle title={title}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'auto',
          background: theme.colors.layoutBodyBackground,
        }}
      >
        <div
          style={{
            flex: 1,
            padding: '32px 0',
          }}
        >
          <div
            style={{
              textAlign: 'center',
            }}
          >
            <div
              style={{
                height: '44px',
                lineHeight: '44px',
              }}
            >
              <Link to="/">
                <img
                  alt="logo"
                  style={{
                    height: '44px',
                    marginRight: '16px',
                    verticalAlign: 'top',
                  }}
                  src={logo}
                />
                <span
                  style={{
                    position: 'relative',
                    top: '2px',
                    color: theme.colors.headingColor,
                    fontWeight: 600,
                    fontSize: '33px',
                  }}
                >
                  {proSettings.title}
                </span>
              </Link>
            </div>
            <div
              style={{
                marginTop: '12px',
                marginBottom: '40px',
                color: theme.colors.textColorSecondary,
                fontSize: theme.fontSizes.base,
              }}
            >
              {proSettings.title}！
            </div>
          </div>
          {children}
        </div>
        <DefaultFooter links={[]} copyright="react" />
      </div>
    </DocumentTitle>
  );
};

export default UserLayout;
