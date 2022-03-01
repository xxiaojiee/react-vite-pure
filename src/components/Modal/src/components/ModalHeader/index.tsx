import React from 'react';
import { BasicTitle } from '/@/components/Basic';

interface ModalHeaderProp {
  helpMessage: string | string[];
  title: string;
}

const ModalHeader: React.FC<ModalHeaderProp> = (props) => {
  const { helpMessage, title } = props;
  return <BasicTitle helpMessage={helpMessage}>{title}</BasicTitle>;
};

export default ModalHeader;
