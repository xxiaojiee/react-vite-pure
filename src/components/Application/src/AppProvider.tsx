import React from 'react';
import { AppProvider } from './useAppContext';

const Index: React.FC<any> = ({ children }: { children: React.ReactNode }) => {
  return <AppProvider>{children}</AppProvider>;
};

export default Index;
