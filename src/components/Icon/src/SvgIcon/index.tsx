import React from 'react';
import classNames from 'classnames';
import { useDesign } from '/@/hooks/web/useDesign';

interface SvgIconProp {
  prefix?: string;
  name: string;
  size?: [number, string];
  spin?: boolean;
  className?:string
}

const SvgIcon: React.FC<SvgIconProp> = (props) => {
  const { prefix='icon',spin=false, name, className='' } = props;
  const { prefixCls } = useDesign('svg-icon');
  const symbolId = `#${prefix}-${name}` ;

  const getStyle = (): React.CSSProperties => {
    const { size } = props;
    let s = `${size}`;
    s = `${s.replace('px', '')}px`;
    return {
      width: s,
      height: s,
    };
  };
  return   <svg
  className={classNames(prefixCls, className, spin && 'svg-icon-spin')}
  style={getStyle()}
  aria-hidden="true"
>
  <use xlinkHref={symbolId} />
</svg>;
};

export default SvgIcon;
