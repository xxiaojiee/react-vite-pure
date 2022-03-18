import React from 'react';

interface MixSiderProp {
  className?: string;
}

const MixSider: React.FC<MixSiderProp> = (props) => {
  const { className } = props;
  return <div>MixSider</div>;
};

export default MixSider;
