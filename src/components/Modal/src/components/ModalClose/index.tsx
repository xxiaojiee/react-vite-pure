import React, { useCallback, MouseEvent } from 'react';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { FullscreenExitOutlined, FullscreenOutlined, CloseOutlined } from '@ant-design/icons';

import { useDesign } from '/@/hooks/web/useDesign';

import './index.less';

interface ModalCloseProp {
  canFullscreen?: boolean;
  fullScreen: boolean;
  onCancel?: (e?: MouseEvent) => any;
  onFullscreen?: (e?: MouseEvent) => any;
}

const ModalClose: React.FC<ModalCloseProp> = (props) => {
  const { canFullscreen = true, onCancel, onFullscreen, fullScreen } = props;
  const { prefixCls } = useDesign('basic-modal-close');

  const getClass = classNames(prefixCls, `${prefixCls}--custom`, {
    [`${prefixCls}--can-full`]: canFullscreen,
  });

  const handleFullScreen = useCallback(
    (e) => {
      e?.stopPropagation();
      e?.preventDefault();
      onFullscreen && onFullscreen(e);
    },
    [onFullscreen],
  );
  const getFullIcon = useCallback(() => {
    if (!canFullscreen) {
      return null;
    }
    return fullScreen ? (
      <Tooltip title="还原" placement="bottom">
        <FullscreenExitOutlined role="full" onClick={handleFullScreen} />
      </Tooltip>
    ) : (
      <Tooltip title="最大化" placement="bottom">
        <FullscreenOutlined role="close" onClick={handleFullScreen} />
      </Tooltip>
    );
  }, [canFullscreen, fullScreen, handleFullScreen]);
  return (
    <div className={getClass}>
      {getFullIcon()}
      <Tooltip title="关闭" placement="bottom">
        <CloseOutlined onClick={onCancel} />
      </Tooltip>
    </div>
  );
};

export default ModalClose;
