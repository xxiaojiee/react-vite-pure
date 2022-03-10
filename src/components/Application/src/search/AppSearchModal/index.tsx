import React, { useRef, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import { SearchOutlined } from '@ant-design/icons';
import { useClickAway } from 'ahooks';
import AppSearchFooter from '../AppSearchFooter';
import Icon from '/@/components/Icon';
import { Input, InputRef } from 'antd';
import { Transition } from '/@/components/Transition';

// import vClickOutside from '/@/directives/clickOutside';
import { useDesign } from '/@/hooks/web/useDesign';
import { useMenuSearch } from '../useMenuSearch';
import { useAppInject } from '/@/hooks/web/useAppInject';

import './index.less';

interface AppSearchModalProp {
  visible?: boolean;
  className?: boolean;
  onClose?: () => void;
}

const AppSearchModal: React.FC<AppSearchModalProp> = (props) => {
  const { visible, className, onClose = () => {} } = props;
  const scrollWrap = useRef<HTMLUListElement>(null);
  const outsideRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<InputRef>(null);

  const { prefixCls } = useDesign('app-search-modal');
  const refs = useRef({});
  const { getIsMobile } = useAppInject();
  const {
    handleSearch,
    searchResult,
    keyword,
    activeIndex,
    handleEnter,
    handleMouseenter,
    setSearchResult,
  } = useMenuSearch(refs.current, scrollWrap, props);

  const getIsNotData = !keyword || searchResult.length === 0;

  const getClass = classNames(prefixCls, className, {
    [`${prefixCls}--mobile`]: getIsMobile(),
  });

  useEffect(() => {
    if (visible) {
      searchRef.current?.focus();
    }
  }, [visible]);

  const handleClose = useCallback(() => {
    setSearchResult([]);
    onClose();
  }, [onClose, setSearchResult]);
  useClickAway(() => {
    handleClose();
  }, outsideRef);
  return ReactDOM.createPortal(
    <Transition
      name="zoom-fade"
      show={visible}
    >
      <div className={getClass}>
        <div className={`${prefixCls}-content`} ref={outsideRef}>
          <div className={`${prefixCls}-input__wrapper`}>
            <Input
              className={`${prefixCls}-input`}
              placeholder="搜索"
              ref={searchRef}
              allowClear
              onChange={handleSearch}
              prefix={<SearchOutlined />}
            />
            <span className={`${prefixCls}-cancel`} onClick={handleClose}>
              取消
            </span>
          </div>
          {getIsNotData ? (
            <div className={`${prefixCls}-not-data`}>暂无搜索结果</div>
          ) : (
            <ul className={`${prefixCls}-list`} ref={scrollWrap}>
              {searchResult.map((item, index) => (
                <li
                  ref={(ref) => {
                    refs.current[index] = ref;
                  }}
                  key={item.path}
                  data-index={index}
                  onMouseEnter={handleMouseenter}
                  onClick={handleEnter}
                  className={classNames(`${prefixCls}-list__item`, {
                    [`${prefixCls}-list__item--active`]: activeIndex === index,
                  })}
                >
                  <div className={`${prefixCls}-list__item-icon`}>
                    <Icon icon={item.icon || 'mdi:form-select'} size={20} />
                  </div>
                  <div className={`${prefixCls}-list__item-text`}>{item.name}</div>
                  <div className={`${prefixCls}-list__item-enter`}>
                    <Icon icon="ant-design:enter-outlined" size={20} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <AppSearchFooter />
        </div>
      </div>
    </Transition>,
    document.body,
  );
};

export default AppSearchModal;
