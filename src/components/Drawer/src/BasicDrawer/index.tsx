import React, { useEffect, useMemo, useRef, useState, isValidElement, useCallback } from 'react';
import type { DrawerInstance, DrawerProps, BasicProps } from '../typing';
import type { CSSProperties } from 'react';
import { useMount } from 'ahooks';
import { Drawer, Spin } from 'antd';
import classNames from 'classnames';
import { isFunction, isNumber } from '/@/utils/is';
import DrawerFooter from '../components/DrawerFooter';
import DrawerHeader from '../components/DrawerHeader';
import { ScrollContainer } from '/@/components/Container';
import { useDesign } from '/@/hooks/web/useDesign';

import './index.less';

const BasicDrawer: React.FC<BasicProps> = (props) => {
  const { handleRegister, visible, loadingText, className, onVisibleChange, ...otherProps } = props;
  const [isShow, setIsShow] = useState<boolean>(false);
  const propsRef = useRef<Partial<Nullable<DrawerProps>>>(null);

  const { prefixVar, prefixCls } = useDesign('basic-drawer');

  function setDrawerProps(drawerProps: Partial<DrawerProps>): void {
    // Keep the last setDrawerProps
    propsRef.current = {
      ...propsRef.current,
      ...drawerProps,
    };
    if (Reflect.has(drawerProps, 'visible')) {
      setIsShow(!!drawerProps.visible);
    }
  }

  const drawerInstance = useRef<DrawerInstance>({
    setDrawerProps,
    emitVisible: undefined,
  });

  useMount(() => {
    handleRegister?.(drawerInstance.current);
  });

  const getMergeProps = useMemo(
    (): Partial<DrawerProps> => ({
      ...otherProps,
      ...propsRef.current,
    }),
    [otherProps],
  );
  const getProps = useMemo((): DrawerProps => {
    const opt = {
      placement: 'right',
      ...getMergeProps,
      visible: isShow,
    };
    opt.title = undefined;
    const { isDetail, width, wrapClassName, getContainer } = opt;
    if (isDetail) {
      if (!width) {
        opt.width = '100%';
      }
      const detailCls = `${prefixCls}__detail`;
      opt.className = wrapClassName ? `${wrapClassName} ${detailCls}` : detailCls;

      if (!getContainer) {
        // TODO type error?
        opt.getContainer = `.${prefixVar}-layout-content` as any;
      }
    }
    return opt as DrawerProps;
  }, [getMergeProps, prefixCls, prefixVar, isShow]);

  // Custom implementation of the bottom button,
  const getFooterHeight = () => {
    const { footerHeight, showFooter } = getProps;
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

  useEffect(() => {
    setIsShow(visible);
    onVisibleChange?.(visible);
    drawerInstance.current.emitVisible?.(visible);
  }, [onVisibleChange, visible]);

  // Cancel event
  const onClose = useCallback(async (e) => {
    e.stopPropagation();
    const { closeFunc } = getProps;
    props.onClose?.();
    if (closeFunc && isFunction(closeFunc)) {
      const res = await closeFunc();
      setIsShow(!res);
      return;
    }
    setIsShow(false);
  },[getProps, props]);

  const handleOk = () => {
    props.onOk?.();
  };
  return (
    <Drawer
      {...getProps}
      title={
        isValidElement(getMergeProps.title) ? (
          getMergeProps.title
        ) : (
          <DrawerHeader
            title={getMergeProps.title}
            isDetail={props.isDetail}
            showDetailBack={props.showDetailBack}
            titleToolbar={props.titleToolbar}
            onClose={onClose}
          />
        )
      }
      className={classNames(prefixCls, className)}
      onClose={onClose}
    >
      <ScrollContainer style={getScrollContentStyle()}>
        <Spin spinning={!!getProps?.loading} tip={loadingText || '加载中...'}>
          {props.children}
        </Spin>
      </ScrollContainer>
      <DrawerFooter {...getProps} onClose={onClose} onOk={handleOk} height={getFooterHeight()} />
    </Drawer>
  );
};

export default BasicDrawer;
