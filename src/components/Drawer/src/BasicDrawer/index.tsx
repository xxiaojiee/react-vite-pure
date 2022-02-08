import React, { useEffect, useMemo, useRef } from 'react';
import type { DrawerInstance, DrawerProps, BasicProps } from '../typing';
import type { CSSProperties } from 'react';
import { Drawer } from 'antd';
import { isFunction, isNumber } from '/@/utils/is';
import { deepMerge } from '/@/utils';
import DrawerFooter from '../components/DrawerFooter';
import DrawerHeader from '../components/DrawerHeader';
// import { ScrollContainer } from '/@/components/Container';
import { useDesign } from '/@/hooks/web/useDesign';

import './index.less';

const BasicDrawer: React.FC<BasicProps> = (props) => {
  const visibleRef = useRef(false);
  const propsRef = useRef<Partial<Nullable<DrawerProps>>>(null);

  const { prefixVar, prefixCls } = useDesign('basic-drawer');

  function setDrawerProps(drawerProps: Partial<DrawerProps>): void {
    // Keep the last setDrawerProps
    propsRef.current = deepMerge(propsRef.current || ({} as any), drawerProps);

    if (Reflect.has(drawerProps, 'visible')) {
      visibleRef.current = !!drawerProps.visible;
    }
  }

  const drawerInstance: DrawerInstance = useMemo(() => {
    return {
      setDrawerProps,
      emitVisible: undefined,
    };
  }, []);

  props.onRegister?.(drawerInstance);

  const getMergeProps = (): DrawerProps => {
    return deepMerge(props, propsRef.current);
  };

  const getProps = (): DrawerProps => {
    const opt = {
      placement: 'right',
      ...getMergeProps(),
      visible: visibleRef.current,
    };
    opt.title = undefined;
    const { isDetail, width, wrapClassName, getContainer } = opt;
    if (isDetail) {
      if (!width) {
        opt.width = '100%';
      }
      const detailCls = `${prefixCls}__detail`;
      opt.class = wrapClassName ? `${wrapClassName} ${detailCls}` : detailCls;

      if (!getContainer) {
        // TODO type error?
        opt.getContainer = `.${prefixVar}-layout-content` as any;
      }
    }
    return opt as DrawerProps;
  };

  // Custom implementation of the bottom button,
  const getFooterHeight = () => {
    const { footerHeight, showFooter } = getProps();
    if (showFooter && footerHeight) {
      return isNumber(footerHeight) ? `${footerHeight}px` : `${footerHeight.replace('px', '')}px`;
    }
    return `0px`;
  };

  const getScrollContentStyle = (): CSSProperties => {
    const footerHeight = getFooterHeight();
    return {
      position: 'relative',
      height: `calc(100% - ${footerHeight})`,
    };
  };

  const getLoading = () => {
    return !!getProps()?.loading;
  };

  useEffect(() => {
    visibleRef.current = props.visible;
    props.onVisibleChange?.(props.visible);
    drawerInstance.emitVisible?.(props.visible);
  }, [drawerInstance, props, props.visible]);

  // Cancel event
  const onClose = async () => {
    const { closeFunc } = getProps();
    props.onClose?.();
    if (closeFunc && isFunction(closeFunc)) {
      const res = await closeFunc();
      visibleRef.current = !res;
      return;
    }
    visibleRef.current = false;
  };

  const handleOk = () => {
    props.onOk?.();
  };
  return (
    <Drawer {...getProps()} className={prefixCls} onClose={onClose}>
      <DrawerHeader
        title={getMergeProps().title}
        isDetail={props.isDetail}
        showDetailBack={props.showDetailBack}
        onClose={onClose}
      />
      {props.children}
      {/* <ScrollContainer
            style={getScrollContentStyle()}
            v-loading="getLoading"
            loading-tip={loadingText || '加载中...'}
            >
            <slot></slot>
            </ScrollContainer>
      */}
      <DrawerFooter {...getProps()} onClose={onClose} onOk={handleOk} height={getFooterHeight()} />
    </Drawer>
  );
};

export default BasicDrawer;
