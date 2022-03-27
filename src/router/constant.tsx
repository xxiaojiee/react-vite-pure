import React, { ComponentType, lazy, Suspense } from 'react';
import { Loading } from '/@/components/Loading';

export const ROOT_NAME = 'Root';
export const LOGIN_NAME = 'Login';
export const MAINOUT_NAME = 'MainOut';
export const PARENT_LAYOUT_NAME = 'ParentLayout';
export const PAGE_NOT_FOUND_NAME = 'PageNotFound';

export const load = <T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  options?: Record<string, any>,
) => {
  const Comp = lazy(factory);
  return React.forwardRef((props: any, ref) => (
    <Suspense fallback={options?.loading ? <Loading loading /> : null}>
      <Comp {...props} ref={ref} />
    </Suspense>
  ));
};
