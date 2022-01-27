import React, { useCallback, useEffect, useRef } from 'react';
import SvgIcon from '../SvgIcon';
import Iconify from '@purge-icons/generated';
import classNames from 'classnames';
import { useMount } from 'ahooks';
import { isString } from '/@/utils/is';

const SVG_END_WITH_FLAG = '|svg';
interface IconProp {
  icon: string;
  // icon color
  color?: string;
  className?: string;
  // icon size
  size?: string | number;
  spin?: boolean;
  prefix?: string;
}

const Icon: React.FC<IconProp> = (props) => {
  const { size = 16, spin = false, prefix = '', icon, color, className } = props;
  const elRef = useRef<ElRef>(null);

  const isSvgIcon = icon?.endsWith(SVG_END_WITH_FLAG);
  const getSvgIcon = icon?.replace(SVG_END_WITH_FLAG, '');
  const iconRef = `${prefix ? `${prefix}:` : ''}${icon}`;

  const update = useCallback(async () => {
    if (isSvgIcon) return;

    const el = elRef.current;
    if (!el) return;

    if (!iconRef) return;

    const svg = Iconify.renderSVG(iconRef, {});
    if (svg) {
      el.textContent = '';
      el.appendChild(svg);
    } else {
      const span = document.createElement('span');
      span.className = 'iconify';
      span.dataset.icon = iconRef;
      el.textContent = '';
      el.appendChild(span);
    }
  }, [iconRef, isSvgIcon]);

  const getWrapStyle = (): React.CSSProperties => {
    let fs = size;
    if (isString(size)) {
      fs = parseInt(size, 10);
    }
    return {
      fontSize: `${fs}px`,
      color,
      display: 'inline-flex',
    };
  };
  useEffect(() => {
    update();
  }, [icon, update]);

  useMount(update);
  return isSvgIcon ? (
    <SvgIcon
      size={size}
      name={getSvgIcon}
      className={classNames(className, 'anticon')}
      spin={spin}
    />
  ) : (
    <span
      ref={elRef}
      className={classNames(className, 'app-iconify anticon', spin && 'app-iconify-spin')}
      style={getWrapStyle()}
    />
  );
};

export default Icon;
