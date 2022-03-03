import React from 'react';
import { BasicTitle } from '/@/components/Basic';
import type { ModalHeaderProp } from '../../props'

const ModalHeader: React.FC<ModalHeaderProp> = (props) => {
  const { helpMessage, title } = props;
  return <BasicTitle helpMessage={helpMessage}>{title}</BasicTitle>;
};

export default ModalHeader;
