import { useCallback, useState, Ref, MutableRefObject } from 'react';
import type { Menu } from '/@/router/types';
import { useMenus } from '/@/router/menus';
import { useHistory } from 'react-router-dom';
import { useDebounceFn, useEventListener } from 'ahooks';
import { cloneDeep } from 'lodash-es';
import { filter, forEach } from '/@/utils/helper/treeHelper';
import { useScrollTo } from '/@/hooks/event/useScrollTo';

export interface SearchResult {
  name: string;
  path: string;
  icon?: string;
}

// Translate special characters
function transform(c: string) {
  const code: string[] = ['$', '(', ')', '*', '+', '.', '[', ']', '?', '\\', '^', '{', '}', '|'];
  return code.includes(c) ? `\\${c}` : c;
}

function createSearchReg(key: string) {
  const keys = [...key].map((item) => transform(item));
  const str = ['', ...keys, ''].join('.*');
  return new RegExp(str);
}

function handlerSearchResult(filterMenu: Menu[], reg: RegExp, parent?: Menu) {
  const ret: SearchResult[] = [];
  filterMenu.forEach((item) => {
    const { name, path, icon, children, hideMenu, meta } = item;
    if (!hideMenu && reg.test(name) && (!children?.length || meta?.hideChildrenInMenu)) {
      ret.push({
        name: parent?.name ? `${parent.name} > ${name}` : name,
        path,
        icon,
      });
    }
    if (!meta?.hideChildrenInMenu && Array.isArray(children) && children.length) {
      ret.push(...handlerSearchResult(children, reg, item));
    }
  });
  return ret;
}



export function useMenuSearch(refs: Ref<HTMLElement[]>, scrollWrap: MutableRefObject<HTMLElement | undefined>, props: Record<string, any>) {
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
  const [keyword, setKeyword] = useState('');
  const { start } = useScrollTo();
  const [activeIndex, setActiveIndex] = useState(-1);

  const menuList: Menu[] = useMenus();

  const { push } = useHistory();

  const search = useCallback((e: ChangeEvent) => {
    e?.stopPropagation();
    const key = e.target.value;
    setKeyword(key.trim())
    if (!key) {
      setSearchResult([]);
      return;
    }
    const reg = createSearchReg(keyword);
    const filterMenu = filter(menuList, (item) => {
      return reg.test(item.name) && !item.hideMenu;
    });
    setSearchResult(handlerSearchResult(filterMenu, reg))
    setActiveIndex(0)
  }, [keyword, menuList])

  const handleSearch = useDebounceFn(search, {
    wait: 200,
  });


  // Activate when the mouse moves to a certain line
  const handleMouseenter = (e: any) => {
    const { index } = e.target.dataset;
    setActiveIndex(Number(index));
  }

  // When the keyboard up and down keys move to an invisible place
  // the scroll bar needs to scroll automatically
  const handleScroll = useCallback(() => {
    const refList = refs;
    if (!refList || !Array.isArray(refList) || refList.length === 0 || !scrollWrap.current) {
      return;
    }

    const index = activeIndex;
    const currentRef = refList[index].current;
    if (!currentRef) {
      return;
    }
    const wrapEl = scrollWrap.current;
    if (!wrapEl) {
      return;
    }
    const scrollHeight = (currentRef.offsetTop as number) + (currentRef.offsetHeight as number);
    const wrapHeight = wrapEl.offsetHeight;
    start({
      el: wrapEl,
      duration: 100,
      to: scrollHeight - wrapHeight,
    });
  }, [activeIndex, refs, scrollWrap, start])

  // Arrow key up
  const handleUp = useCallback(() => {
    if (!searchResult.length) return;
    setActiveIndex((preState) => preState - 1)
    if (activeIndex < 0) {
      setActiveIndex(searchResult.length - 1)
    }
    handleScroll();
  }, [activeIndex, handleScroll, searchResult.length])

  // Arrow key down
  const handleDown = useCallback(() => {
    if (!searchResult.length) return;
    setActiveIndex((preState) => preState + 1)
    if (activeIndex > searchResult.length - 1) {
      setActiveIndex(0)
    }
    handleScroll();
  }, [activeIndex, handleScroll, searchResult.length])

  // close search modal
  const handleClose = useCallback(() => {
    setSearchResult([])
    props.onClose();
  }, [props])

  // enter keyboard event
  const handleEnter = useCallback(() => {
    if (!searchResult.length) {
      return;
    }
    if (searchResult.length === 0 || activeIndex < 0) {
      return;
    }
    const to = searchResult[activeIndex];
    handleClose();
    push(to.path);
  }, [activeIndex, handleClose, push, searchResult])

  useEventListener('keydown', (ev) => {
    switch (ev.key) {
      case 'Enter':
        handleEnter();
        break;
      case 'ArrowUp':
        handleUp();
        break;
      case 'ArrowDown':
        handleDown();
        break;
      case 'Escape':
        handleClose();
        break;
      default:
        break;
    }
  });

  return {
    handleSearch,
    searchResult,
    setSearchResult,
    keyword,
    activeIndex,
    handleMouseenter,
    handleEnter
  };
}
