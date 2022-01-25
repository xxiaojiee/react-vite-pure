import React, { ComponentType, lazy, Suspense } from 'react';
import { Loading } from '/@/components/Loading';

export const ROOT_NAME = 'Root';
export const LOGIN_NAME = 'Login';
export const REDIRECT_NAME = 'Redirect';
export const PARENT_LAYOUT_NAME = 'ParentLayout';
export const PAGE_NOT_FOUND_NAME = 'PageNotFound';


export const load = <T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  options?: Record<string, any>,
) => {
  const Comp = lazy(factory);
  return (props: any) => (
    <Suspense fallback={options?.loading ? <Loading loading /> : null}>
      <Comp {...props} />
    </Suspense>
  );
};

export const EXCEPTION_COMPONENT = load(() => import('/@/pages/sys/exception'));

export const LAYOUT = load(() => import('/@/layouts/default/index'));
