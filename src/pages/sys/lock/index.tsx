import React from 'react';
import LockPage from './LockPage';
import { CSSTransition } from 'react-transition-group';
import { useStoreState } from '/@/store';

const Lock = () => {
  const lockState = useStoreState('lock');
  const isLock = lockState.lockInfo?.isLock ?? false
  return (
    <CSSTransition in={isLock} classNames="fade-bottom" timeout={300} unmountOnExit>
      <LockPage />
    </CSSTransition>
  );
};

export default Lock;
