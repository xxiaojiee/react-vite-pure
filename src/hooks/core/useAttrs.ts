
import type { RefAttributes } from 'react';

interface Params {
  excludeListeners?: boolean;
  excludeKeys?: string[];
  excludeDefaultKeys?: boolean;
}

const DEFAULT_EXCLUDE_KEYS = ['class', 'style'];
const LISTENER_PREFIX = /^on[A-Z]/;

export function entries<T>(obj: Recordable<T>): Array<[string, T]> {
  return Object.keys(obj).map((key: string) => [key, obj[key]]);
}

export function useAttrs(props: Record<string, any>, params: Params = {}): RefAttributes<Recordable> | {} {
  const { excludeListeners = false, excludeKeys = [], excludeDefaultKeys = true } = params;
  const allExcludeKeys = excludeKeys.concat(excludeDefaultKeys ? DEFAULT_EXCLUDE_KEYS : []);

  const attrs = entries(props).reduce((acm, [key, val]) => {
    if (!allExcludeKeys.includes(key) && !(excludeListeners && LISTENER_PREFIX.test(key))) {
      acm[key] = val;
    }

    return acm;
  }, {});

  return attrs;
}
