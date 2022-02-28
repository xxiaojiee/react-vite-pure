import React from 'react';
import { CheckOutlined } from '@ant-design/icons';

import { useDesign } from '/@/hooks/web/useDesign';

import { baseHandler } from '../../handler';
import { HandlerEnum } from '../../enum';
import classNames from 'classnames';

import './index.less'

interface ThemeColorPickerProp {
  colorList: string[];
  event: HandlerEnum;
  def: string;
}

const ThemeColorPicker: React.FC<ThemeColorPickerProp> = (props) => {
  const { colorList = [], event, def } = props;
  const { prefixCls } = useDesign('setting-theme-picker');

  const handleClick = (color: string) => {
    event && baseHandler(event, color);
  };
  return (
    <div className={prefixCls}>
      {colorList.map((color) => (
        <span
          key={color}
          onClick={() => {
            handleClick(color);
          }}
          className={classNames(`${prefixCls}__item`, {
            [`${prefixCls}__item--active`]: def === color,
          })}
          style={{ background: color }}
        >
          <CheckOutlined />
        </span>
      ))}
    </div>
  );
};

export default ThemeColorPicker;
