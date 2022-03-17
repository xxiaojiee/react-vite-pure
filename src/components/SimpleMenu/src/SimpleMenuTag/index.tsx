import classNames from 'classnames';
import React, { useMemo } from 'react';
import { useDesign } from '/@/hooks/web/useDesign';
import type { Menu } from '/@/router/types';

interface SimpleMenuTagProp {
  className?: string;
  item: Menu;
  dot: boolean;
  collapseParent: boolean;
}

const SimpleMenuTag: React.FC<SimpleMenuTagProp> = (props) => {
  const { className, item, dot, collapseParent } = props;
  const { prefixCls } = useDesign('simple-menu');

  const getShowTag = useMemo(() => {
    if (!item) return false;

    const { tag } = item;
    if (!tag) return false;

    const { dot: dots, content } = tag;
    if (!dots && !content) return false;
    return true;
  }, [item]);

  const getContent = useMemo(() => {
    if (!getShowTag) return '';
    const { tag } = item;
    const { dot: dots, content } = tag!;
    return dots || collapseParent ? '' : content;
  }, [collapseParent, getShowTag, item]);

  const getTagClass = useMemo(() => {
    const { tag = {} } = item || {};
    const { dot: dots, type = 'error' } = tag;
    const tagCls = `${prefixCls}-tag`;
    return classNames(tagCls, className, [`${tagCls}--${type}`], {
      [`${tagCls}--collapse`]: collapseParent,
      [`${tagCls}--dot`]: dots || dot,
    });
  }, [collapseParent, dot, item, prefixCls, className]);
  return getShowTag ? <span className={getTagClass}>{getContent}</span> : null;
};

export default SimpleMenuTag;
