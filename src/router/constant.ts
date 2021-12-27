export const REDIRECT_NAME = 'Redirect';
export const PARENT_LAYOUT_NAME = 'ParentLayout';
export const PAGE_NOT_FOUND_NAME = 'PageNotFound';

export const EXCEPTION_COMPONENT = () => import('/@/pages/sys/exception');

/**
 * @description: default layout
 */
export const LAYOUT = () => import('/@/layouts/default/index');

/**
 * @description: parent-layout
 */
export const getParentLayout = () => {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: PARENT_LAYOUT_NAME,
      });
    });
};
