import React from 'react';

interface MenuItemProp {
  className?: string;
}

const MenuItem: React.FC<MenuItemProp> = (props) => {
  const { className } = props;
  return <div>MenuItem</div>;
};

export default MenuItem;
