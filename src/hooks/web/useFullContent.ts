

import { useStoreState } from '/@/store';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom'
import queryString from 'query-string';

/**
 * @description: 全屏显示内容
 */
export const useFullContent = () => {
  const appState = useStoreState('app');
  const location = useLocation();
  const query = queryString.parse(location.search)
  const { fullContent } = appState.projectConfig || {}
  // 是否全屏显示内容而不显示菜单
  const newFullContent = useMemo(() => {
    // 查询参数，地址栏有全参数时全屏显示
    if (query && Reflect.has(query, '__full__')) {
      return true;
    }
    // 返回配置文件中的配置
    return fullContent;
  }, [fullContent, query]);

  return newFullContent;
};
