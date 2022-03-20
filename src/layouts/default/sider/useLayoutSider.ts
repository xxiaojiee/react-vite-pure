
import { MutableRefObject, useState } from 'react';
import { TriggerEnum } from '/@/enums/menuEnum';

import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useDebounceFn, useMount } from 'ahooks';

/**
 * 处理菜单事件相关操作
 */
export function useSiderEvent() {
  const [broken, setBroken] = useState<boolean>(false);

  const { miniWidthNumber } = useMenuSetting();

  const collapsedWidth = broken ? 0 : miniWidthNumber;

  function onBreakpointChange(brokens: boolean) {
    setBroken(brokens)
  }

  return { collapsedWidth, onBreakpointChange };
}

/**
 * 处理菜单折叠的相关操作
 */
export function useTrigger(isMobile: boolean) {
  const { trigger, split } = useMenuSetting();

  const showTrigger = (
    trigger !== TriggerEnum.NONE &&
    !isMobile &&
    (trigger === TriggerEnum.FOOTER || split)
  );

  const triggerAttr = showTrigger ? {} : {
    trigger: null,
  }

  return { triggerAttr, showTrigger };
}

/**
 * 处理菜单拖放相关操作
 * @param siderRef
 * @param dragBarRef
 */
export function useDragLine(siderRef: MutableRefObject<any>, dragBarRef: MutableRefObject<any>, mix = false) {
  const { miniWidthNumber, collapsed, setMenuSetting } = useMenuSetting();
  const handleMouseMove = (ele: any, wrap: any, clientX: number) => {
    document.onmousemove = function (innerE) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      let iT = ele.left + (innerE.clientX - clientX);
      // innerE = innerE || window.event;
      const maxT = 800;
      const minT = miniWidthNumber;
      iT < 0 && (iT = 0);
      iT > maxT && (iT = maxT);
      iT < minT && (iT = minT);
      // eslint-disable-next-line no-multi-assign
      ele.style.left = wrap.style.width = `${iT}px`;
      return false;
    };
  }

  // Drag and drop in the menu area-release the mouse
  const removeMouseup = (ele: any) => {
    const wrap = siderRef.current;
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
      wrap.style.transition = 'width 0.2s';
      const width = parseInt(wrap.style.width, 10);

      if (!mix) {
        const miniWidth = miniWidthNumber;
        if (!collapsed) {
          width > miniWidth + 20
            ? setMenuSetting({ menuWidth: width })
            : setMenuSetting({ collapsed: true });
        } else {
          width > miniWidth && setMenuSetting({ collapsed: false, menuWidth: width });
        }
      } else {
        setMenuSetting({ menuWidth: width });
      }

      ele.releaseCapture?.();
    };
  }

  const changeWrapWidth = () => {
    const ele = dragBarRef.current;
    if (!ele) return;
    const wrap = siderRef.current;
    if (!wrap) return;

    ele.onmousedown = (e: any) => {
      wrap.style.transition = 'unset';
      const clientX = e?.clientX;
      ele.left = ele.offsetLeft;
      handleMouseMove(ele, wrap, clientX);
      removeMouseup(ele);
      ele.setCapture?.();
      return false;
    };
  }

  const { run: exec } = useDebounceFn(changeWrapWidth, {
    wait: 80
  });

  useMount(() => {
    exec();
  });

  return {};
}
