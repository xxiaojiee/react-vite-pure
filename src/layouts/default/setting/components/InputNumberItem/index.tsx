import React from 'react';
import { InputNumber } from 'antd';
import { useDesign } from '/@/hooks/web/useDesign';
import { baseHandler } from '../../handler';
import { HandlerEnum } from '../../enum';
import './index.less';

interface InputNumberItemProp {
  event?: HandlerEnum;
  title: string;
  [index: string]: any;
}

const InputNumberItem: React.FC<InputNumberItemProp> = (props) => {
  const { event, title, ...otherProps } = props;
  const { prefixCls } = useDesign('setting-input-number-item');

  const handleChange = (e) => {
    event && baseHandler(event, e);
  };
  return (
    <div className={prefixCls}>
      <span> {title}</span>
      <InputNumber
        {...otherProps}
        size="small"
        className={`${prefixCls}-input-number`}
        onChange={handleChange}
      />
    </div>
  );
};

export default InputNumberItem;
