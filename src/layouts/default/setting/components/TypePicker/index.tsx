import React from 'react';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { useDesign } from '/@/hooks/web/useDesign';
import { menuTypeList as menuTypeListType } from '../../enum';

import './index.less';

interface TypePickerProp {
  menuTypeList: typeof menuTypeListType;
  handler: Fn;
  def: string;
}

const TypePicker: React.FC<TypePickerProp> = (props) => {
  const { menuTypeList = [], handler = () => ({}), def = '' } = props;
  const { prefixCls } = useDesign('setting-menu-type-picker');
  return (
    <div className={prefixCls}>
      {menuTypeList.map((item) => (
        <Tooltip title={item.title} placement="bottom" key={item.title}>
          <div
            onClick={() => handler(item)}
            className={classNames(`${prefixCls}__item`, `${prefixCls}__item--${item.type}`, {
              [`${prefixCls}__item--active`]: def === item.type,
            })}
          >
            <div className="mix-sidebar" />
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

export default TypePicker;
