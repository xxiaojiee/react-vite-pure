import React from 'react';
import LockPage from './LockPage';
import { useStoreState } from '/@/store';


const Lock = () => {
  const lockState = useStoreState('lock');
  const isLock = lockState.lockInfo?.isLock ?? false;
  return isLock ? <LockPage /> : null;
};

export default Lock;
