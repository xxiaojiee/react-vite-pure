import React from 'react';
import Icon from '/@/components/Icon/index';
import { useDesign } from '/@/hooks/web/useDesign';
import { ContentProps } from '../props';

const MenuItemContent: React.FC<ContentProps> = (props) => {
  // const { item = null, showTitle = true, level = 0, isHorizontal = true } = props;
  const { item = null } = props;
  const { prefixCls } = useDesign('basic-menu-item-content');
  return (
    <span className={`${prefixCls}- flex items-center `}>
      {item?.icon ? (
        <Icon
          icon={item?.icon}
          size={18}
          className={`${prefixCls}-wrapper__icon mr-2`}
        />
      ) : null}
      {item?.name}
    </span>
  );
};

export default MenuItemContent;
