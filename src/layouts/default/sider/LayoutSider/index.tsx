import React from 'react';
import { Layout } from 'antd';
import LayoutMenu from '../../menu';
import LayoutTrigger from '/@/layouts/default/trigger';

import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';

import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useTrigger, useDragLine, useSiderEvent } from '../useLayoutSider';
import { useAppInject } from '/@/hooks/web/useAppInject';
import { useDesign } from '/@/hooks/web/useDesign';

import DragBar from '../DragBar';

interface LayoutSiderProp {
  className?: string;
}

const LayoutSider: React.FC<LayoutSiderProp> = (props) => {
  const { className } = props;
  return <div>LayoutSider</div>;
};

export default LayoutSider;
