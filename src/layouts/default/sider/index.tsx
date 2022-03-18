import React from 'react';

interface SiderProp {
  className?: string;
}

const Sider: React.FC<SiderProp> = (props) => {
  const { className } = props;
  return <div>Sider</div>;
};

export default Sider;
