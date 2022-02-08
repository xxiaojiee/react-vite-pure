import React from 'react';
import BasicHelp from '../BasicHelp';
import classNames from 'classnames';
import { useDesign } from '/@/hooks/web/useDesign';
import './index.less';

interface BasicArrowProp {
  helpMessage?: string | string[];
  span: boolean;
  normal: boolean;
}

const BasicArrow: React.FC<BasicArrowProp> = (props) => {
  const { helpMessage = '', span, normal } = props;
  const { prefixCls } = useDesign('basic-title');
  const getClass = classNames(
    prefixCls,
    { [`${prefixCls}-show-span`]: span && props.children },
    { [`${prefixCls}-normal`]: normal },
  );
  return (
    <span className={getClass}>
      {props.children}
      {helpMessage ? <BasicHelp className={`${prefixCls}-help`} text={helpMessage} /> : null}
    </span>
  );
};

export default BasicArrow;
