import React from 'react';
import { Tooltip } from 'antd';
import { useFullscreen } from 'ahooks';

import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';

import './index.less';

interface FullScreenProp {
  className?: string;
}

const FullScreen: React.FC<FullScreenProp> = (props) => {
  const { className } = props;
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(() => document.body);

  const getTitle = isFullscreen ? '退出全屏' : '全屏';

  return (
    <Tooltip title={getTitle} placement="bottom" mouseEnterDelay={0.5} className={className}>
      <span onClick={toggleFullscreen}>
        {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
      </span>
    </Tooltip>
  );
};

export default FullScreen;
