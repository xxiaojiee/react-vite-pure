import React from 'react';
import type { Menu } from '/@/router/types';

import { Breadcrumb } from 'antd';

import { useDesign } from '/@/hooks/web/useDesign';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { isString } from '/@/utils/is';
import { filter } from '/@/utils/helper/treeHelper';
import { useMenus } from '/@/router/menus';

import { REDIRECT_NAME } from '/@/router/constant';
import { getAllParentPath } from '/@/router/helper/menuHelper';

interface LayoutBreadcrumbProp {
  theme: 'dark' | 'light';
}

const LayoutBreadcrumb:React.FC<LayoutBreadcrumbProp> = (props) => {

  return <div>LayoutBreadcrumb</div>;
};

export default LayoutBreadcrumb;
