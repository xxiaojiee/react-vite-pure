import type { Menu } from '/@/router/types';

import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';
import { ThemeEnum } from '/@/enums/appEnum';
import type { MenuTheme } from 'antd';
import type { MenuMode } from 'antd/lib/menu';

// export const basicProps = {
//   items: {
//     type: Array as PropType<Menu[]>,
//     default: () => [],
//   },
//   collapsedShowTitle: propTypes.bool,
//   // 最好是4 倍数
//   inlineIndent: propTypes.number.def(20),
//   // 菜单组件的mode属性
//   mode: {
//     type: String as PropType<MenuMode>,
//     default: MenuModeEnum.INLINE,
//   },

//   type: {
//     type: String as PropType<MenuTypeEnum>,
//     default: MenuTypeEnum.MIX,
//   },
//   theme: {
//     type: String as PropType<MenuTheme>,
//     default: ThemeEnum.DARK,
//   },
//   inlineCollapsed: propTypes.bool,
//   mixSider: propTypes.bool,

//   isHorizontal: propTypes.bool,
//   accordion: propTypes.bool.def(true),
//   beforeClickFn: {
//     type: Function as PropType<(key: string) => Promise<boolean>>,
//   },
// };

export interface ItemProps {
  item: Menu;
  level: number;
  theme: 'dark' | 'light';
  showTitle: boolean;
  isHorizontal: boolean;
};

export interface ContentProps {
  item?: Menu;
  showTitle?: boolean;
  level?: number;
  isHorizontal?: boolean;
};
