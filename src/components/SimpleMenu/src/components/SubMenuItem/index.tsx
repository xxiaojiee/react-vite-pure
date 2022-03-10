import React from 'react';

interface SubMenuItemProp {
  className?: string;
}

const SubMenuItem: React.FC<SubMenuItemProp> = (props) => {
  const { className } = props;
  return <div>SubMenuItem</div>;
};

export default SubMenuItem;
