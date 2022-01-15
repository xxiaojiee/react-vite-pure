import { load } from '/@/router/constant';
import FullScreen from './FullScreen';

export const UserDropDown = load(() => import('./user-dropdown'), {
  loading: true,
});

export const LayoutBreadcrumb = load(() => import('./Breadcrumb'));

export const Notify = load(() => import('./notify'));

export const ErrorAction = load(() => import('./ErrorAction'));

export { FullScreen };
