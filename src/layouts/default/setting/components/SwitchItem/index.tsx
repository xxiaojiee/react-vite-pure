import React, { useMemo } from 'react';
import { Switch } from 'antd';
import { useDesign } from '/@/hooks/web/useDesign';
import { baseHandler } from '../../handler';
import { HandlerEnum } from '../../enum';

import './index.less';

interface SwitchItemProp {
  event: HandlerEnum;
  disabled: boolean;
  title: string;
  def: boolean;
}

const SwitchItem: React.FC<SwitchItemProp> = (props) => {
  const { def, event, title, disabled } = props;
  const { prefixCls } = useDesign('setting-switch-item');

  const getBindValue = useMemo(() => {
    return def ? { checked: def } : {};
  }, [def]);
  const handleChange = (e) => {
    event && baseHandler(event, e);
  };
  return (
    <div className={prefixCls}>
      <span> {title}</span>
      <Switch
        {...getBindValue}
        onChange={handleChange}
        disabled={disabled}
        checkedChildren="开"
        unCheckedChildren="关"
      />
    </div>
  );
};

export default SwitchItem;
