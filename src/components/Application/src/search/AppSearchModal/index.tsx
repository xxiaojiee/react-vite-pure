import React, { useRef, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import { SearchOutlined } from '@ant-design/icons';
import AppSearchFooter from '../AppSearchFooter';
import Icon from '/@/components/Icon';

// import vClickOutside from '/@/directives/clickOutside';
import { useDesign } from '/@/hooks/web/useDesign';
import { useMenuSearch } from '../useMenuSearch';
import { useAppInject } from '/@/hooks/web/useAppInject';

interface AppSearchModalProp {
  visible?: boolean;
  className?: boolean;
  onClose?: () => void;
}

const AppSearchModal: React.FC<AppSearchModalProp> = (props) => {
  const { visible, className, onClose = () => {} } = props;
  const scrollWrap = useRef();
  const inputRef = useRef<Nullable<HTMLElement>>(null);

  const { prefixCls } = useDesign('app-search-modal');
  const refs = useRef([]);
  const { getIsMobile } = useAppInject();

  const {
    handleSearch,
    searchResult,
    keyword,
    activeIndex,
    handleEnter,
    handleMouseenter,
    setSearchResult,
  } = useMenuSearch(refs, scrollWrap, props);

  const getIsNotData = !keyword || searchResult.length === 0;

  const getClass = classNames(prefixCls, {
    [`${prefixCls}--mobile`]: getIsMobile(),
  });

  useEffect(() => {
    if (visible) {
      inputRef.current?.focus();
    }
  }, [visible]);

  const handleClose = useCallback(() => {
    setSearchResult([]);
    onClose();
  }, [onClose, setSearchResult]);
  return <div>AppSearchModal</div>;
};

export default AppSearchModal;
