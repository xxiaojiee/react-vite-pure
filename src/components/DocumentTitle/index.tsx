import React, { useEffect } from 'react';

export const DocumentTitle: React.FC<{ title: string }> = ({ title, children }: any) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <>{children}</>;
};
