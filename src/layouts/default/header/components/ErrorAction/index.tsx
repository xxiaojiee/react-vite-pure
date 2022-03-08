import React from 'react';
import { Tooltip, Badge } from 'antd';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Icon from '/@/components/Icon';

import { actions, useStoreState } from '/@/store';
import { PageEnum } from '/@/enums/pageEnum';

interface ErrorActionProp {
  className?: string;
}

const errorLogActions = actions.errorLog;

const ErrorAction: React.FC<ErrorActionProp> = (props) => {
  const { className } = props;
  const errorLogState = useStoreState('errorLog');
  const { push } = useHistory();
  const dispatch = useDispatch();

  const getCount = errorLogState.errorLogListCount;

  const handleToErrorList = () => {
    push(PageEnum.ERROR_LOG_PAGE);
    dispatch(errorLogActions.setErrorLogListCount(0));
  };
  return (
    <Tooltip title="错误日志" placement="bottom" mouseEnterDelay={0.5} className={className} >
      <Badge count={getCount} offset={[0, 10]} overflowCount={99}>
        <Icon icon="ion:bug-outline" onClick={handleToErrorList} />
      </Badge>
    </Tooltip>
  );
};

export default ErrorAction;
