import type { Menu } from '/@/router/types';

import { MenuTypeEnum } from '/@/enums/menuEnum';
import type { MenuTheme } from 'antd';

export interface BasicProps {
  items: Menu[];
  collapsedShowTitle: boolean;
  // 最好是4 倍数
  inlineIndent?: number;
  // 菜单组件的mode属性
  mode: 'horizontal' | 'vertical' | 'inline';

  type?: MenuTypeEnum;
  theme?: MenuTheme;
  inlineCollapsed: boolean;
  mixSider: boolean;

  isHorizontal: boolean;
  accordion?: boolean;
  beforeClickFn: (key: string) => Promise<boolean>;
  menuClick: (key: string) => any;
};

export interface ItemProps {
  item: Menu;
  level?: number;
  theme: 'dark' | 'light';
  showTitle?: boolean;
  isHorizontal: boolean;
};

export interface ContentProps {
  item?: Menu;
  showTitle?: boolean;
  level?: number;
  isHorizontal?: boolean;
};
