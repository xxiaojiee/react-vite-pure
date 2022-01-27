import React from 'react';
import { Select } from 'antd';
import { useDesign } from '/@/hooks/web/useDesign';
import { baseHandler } from '../../handler';
import { HandlerEnum } from '../../enum';

import './index.less';

interface SelectItemProp {
  event: HandlerEnum;
  disabled: boolean;
  title: string;
  def: string | number;
  initValue: string | number;
  options: LabelValueOptions;
}

const SelectItem: React.FC<SelectItemProp> = (props) => {
  const { options = [], def, initValue, event, title, disabled } = props;
  const { prefixCls } = useDesign('setting-select-item');
  const getBindValue = () => {
    return def ? { value: def, defaultValue: initValue || def } : {};
  };

  const handleChange = (e: any) => {
    event && baseHandler(event, e);
  };
  return (
    <div className={prefixCls}>
      <span> {title}</span>
      <Select
        {...getBindValue()}
        className={`${prefixCls}-select`}
        onChange={handleChange}
        disabled={disabled}
        size="small"
        options={options}
      />
    </div>
  );
};

export default SelectItem;
