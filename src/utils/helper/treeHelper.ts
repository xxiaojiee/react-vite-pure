interface TreeHelperConfig {
  id: string;
  children: string;
  pid: string;
}
const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  children: 'children',
  pid: 'pid',
};

const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config);

// tree from list
export function listToTree<T = any>(list: any[], config: Partial<TreeHelperConfig> = {}): T[] {
  const conf = getConfig(config) as TreeHelperConfig;
  const nodeMap = new Map();
  const result: T[] = [];
  const { id, children, pid } = conf;

  for (const node of list) {
    node[children] = node[children] || [];
    nodeMap.set(node[id], node);
  }
  for (const node of list) {
    const parent = nodeMap.get(node[pid]);
    (parent ? parent[children] : result).push(node);
  }
  return result;
}

export function treeToList<T = any>(tree: any, config: Partial<TreeHelperConfig> = {}): T {
  const newConfig = getConfig(config);
  const { children } = newConfig;
  const result: any = [...tree];
  for (let i = 0; i < result.length; i++) {
    if (!result[i][children!]) continue;
    result.splice(i + 1, 0, ...result[i][children!]);
  }
  return result;
}

export function findNode<T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {},
): T | null {
  const newConfig = getConfig(config);
  const { children } = newConfig;
  const list = [...tree];
  for (const node of list) {
    if (func(node)) return node;
    node[children!] && list.push(...node[children!]);
  }
  return null;
}

export function findNodeAll<T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {},
): T[] {
  const newConfig = getConfig(config);
  const { children } = newConfig;
  const list = [...tree];
  const result: T[] = [];
  for (const node of list) {
    func(node) && result.push(node);
    node[children!] && list.push(...node[children!]);
  }
  return result;
}

export function findPath<T = any>(
  tree: any,
  func: Fn,
  config: Partial<TreeHelperConfig> = {},
): T | T[] | null {
  const newConfig = getConfig(config);
  const path: T[] = [];
  const list = [...tree];
  const visitedSet = new Set();
  const { children } = newConfig;
  while (list.length) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      node[children!] && list.unshift(...node[children!]);
      path.push(node);
      if (func(node)) {
        return path;
      }
    }
  }
  return null;
}

export function findPathAll(tree: any, func: Fn, config: Partial<TreeHelperConfig> = {}) {
  const newConfig = getConfig(config);
  const path: any[] = [];
  const list = [...tree];
  const result: any[] = [];
  const visitedSet = new Set();
  const { children } = newConfig;
  while (list.length) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      node[children!] && list.unshift(...node[children!]);
      path.push(node);
      func(node) && result.push([...path]);
    }
  }
  return result;
}

export function filter<T = any>(
  tree: T[],
  func: (n: T) => boolean,
  config: Partial<TreeHelperConfig> = {},
): T[] {
  const newConfig = getConfig(config);
  const children = newConfig.children as string;
  function listFilter(list: T[]) {
    return list
      .map((node: any) => ({ ...node }))
      .filter((node) => {
        node[children] = node[children] && listFilter(node[children]);
        return func(node) || (node[children] && node[children].length);
      });
  }
  return listFilter(tree);
}

export function forEach<T = any>(
  tree: T[],
  func: (n: T) => any,
  config: Partial<TreeHelperConfig> = {},
): void {
  const newConfig = getConfig(config);
  const list: any[] = [...tree];
  const { children } = newConfig;
  for (let i = 0; i < list.length; i++) {
    // func 返回true就终止遍历，避免大量节点场景下无意义循环，引起浏览器卡顿
    if (func(list[i])) {
      return;
    }
    children && list[i][children] && list.splice(i + 1, 0, ...list[i][children]);
  }
}

/**
 * @description: Extract tree specified structure
 */
export function treeMap<T = any>(treeData: any[], opt: { children?: string; conversion: Fn }): T[] {
  return treeData.map((item, index) => treeMapEach(item, opt, {
    level: 1,
    index
  }));
}

/**
 * @description: Extract tree specified structure
 */
export function treeMapEach(
  data: any,
  { children = 'children', conversion }: { children?: string; conversion: Fn },
  levelIndex: { level: number; index: number; },
) {
  const haveChildren = Array.isArray(data[children]) && data[children].length > 0;
  const conversionData = conversion(data, levelIndex) || {};
  if (haveChildren) {
    return {
      ...conversionData,
      [children]: data[children].map((i: number, index) =>
        treeMapEach(i, {
          children,
          conversion,
        }, {
          level: levelIndex.level + 1,
          index
        }),
      ),
    };
  } else {
    return {
      ...conversionData,
    };
  }
}

/**
 * 递归遍历树结构
 * @param treeDatas 树
 * @param callBack 回调
 * @param parentNode 父节点
 */
export function eachTree(treeDatas: any[], callBack: Fn, parentNode = {}) {
  treeDatas.forEach((element) => {
    const newNode = callBack(element, parentNode) || element;
    if (element.children) {
      eachTree(element.children, callBack, newNode);
    }
  });
}
