import React from 'react';
import classNames from 'classnames';
import { BasicArrow, BasicTitle } from '/@/components/Basic';

interface CollapseHeaderProp {
  prefixCls: string;
  helpMessage?: string[] | string;
  title?: string;
  className?: string;
  show: boolean;
  canExpan: boolean;
  expand: () => void;
  action: React.ReactNode;
}

const CollapseHeader: React.FC<CollapseHeaderProp> = (props) => {
  const {
    helpMessage = '',
    className = '',
    prefixCls,
    title = '',
    canExpan,
    show,
    expand = () => {},
    action = null,
  } = props;
  const classNameMains = classNames(`${prefixCls}__header px-2 py-5`, className);
  return (
    <div className={classNameMains}>
      <BasicTitle onHelpMessage={helpMessage} normal>
        {title}
      </BasicTitle>
      {canExpan ? (
        <div className={`${prefixCls}__action`}>
          {action}
          <BasicArrow up expand={show} onClick={expand} />
        </div>
      ) : null}
    </div>
  );
};

export default CollapseHeader;
