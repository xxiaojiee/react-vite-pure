import React from 'react';

const Content: React.FC = (props) => {
  return <div>
    Content
    {props.children}
  </div>;
};

export default Content;
