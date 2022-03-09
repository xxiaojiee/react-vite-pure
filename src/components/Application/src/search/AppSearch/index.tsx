import React, { useState } from 'react';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { SearchOutlined } from '@ant-design/icons';
import AppSearchModal from '../AppSearchModal';

interface AppSearchProp {
  className?: string;
}

const AppSearch: React.FC<AppSearchProp> = (props) => {
  const { className } = props;
  const [showModal, setShowModal] = useState(false);

  const changeModal = (show: boolean) => {
    setShowModal(show);
  };
  return (
    <>
      <div
        className={classNames('p-1', className)}
        onClick={(e) => {
          e.stopPropagation();
          changeModal(true);
        }}
      >
        <Tooltip title="搜索">
          <SearchOutlined />
        </Tooltip>
      </div>
      <AppSearchModal
        onClose={() => {
          changeModal(false);
        }}
        visible={showModal}
      />
    </>
  );
};

export default AppSearch;
