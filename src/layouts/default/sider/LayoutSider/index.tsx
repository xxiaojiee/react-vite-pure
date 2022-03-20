import React, { useMemo, useRef, CSSProperties } from 'react';
import { Layout } from 'antd';
import classNames from 'classnames';
import LayoutMenu from '../../menu';
import LayoutTrigger from '/@/layouts/default/trigger';
import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';

import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useTrigger, useDragLine, useSiderEvent } from '../useLayoutSider';
import { useAppInject } from '/@/hooks/web/useAppInject';
import { useDesign } from '/@/hooks/web/useDesign';

import DragBar from '../DragBar';

import './index.less';

const { Sider } = Layout;

const LayoutSider: React.FC = () => {
  const dragBarRef = useRef<ElRef>(null);
  const sideRef = useRef<ElRef>(null);

  const {
    collapsed,
    menuWidth,
    split,
    menuTheme,
    realWidth,
    menuHidden,
    menuFixed,
    isMixMode,
  } = useMenuSetting();

  const { prefixCls } = useDesign('layout-sideBar');

  const { isMobile } = useAppInject();

  const { triggerAttr, showTrigger } = useTrigger(isMobile);

  useDragLine(sideRef, dragBarRef);

  const { collapsedWidth, onBreakpointChange } = useSiderEvent();

  const mode = split ? MenuModeEnum.INLINE : undefined;

  const splitType = split ? MenuSplitTyeEnum.LEFT : MenuSplitTyeEnum.NONE;

  const classSideBarRef = split ? !menuHidden : true;

  const siderClass = classNames(prefixCls, {
    [`${prefixCls}--fixed`]: menuFixed,
    [`${prefixCls}--mix`]: isMixMode && !isMobile,
  });

  const hiddenDomStyle = useMemo((): CSSProperties => {
    const width = `${realWidth}px`;
    return {
      width,
      overflow: 'hidden',
      flex: `0 0 ${width}`,
      maxWidth: width,
      minWidth: width,
      transition: 'all 0.2s',
    };
  }, [realWidth]);
  return (
    <>
      {menuFixed && !isMobile && classSideBarRef ? <div style={hiddenDomStyle} /> : null}
      {classSideBarRef ? (
        <Sider
          ref={sideRef}
          breakpoint="lg"
          collapsible
          className={siderClass}
          width={menuWidth}
          collapsed={collapsed}
          collapsedWidth={collapsedWidth}
          theme={menuTheme}
          onBreakpoint={onBreakpointChange}
          trigger={showTrigger ? <LayoutTrigger theme={menuTheme} /> : null}
          {...triggerAttr}
        >
          <LayoutMenu theme={menuTheme} menuMode={mode} splitType={splitType} />
          <DragBar ref={dragBarRef} />
        </Sider>
      ) : null}
    </>
  );
};

export default LayoutSider;
