/**
The routing of this file will not show the layout.
It is an independent new page.
the contents of the file still need to log in to access
 */
import type { AppRouteModule } from '/@/router/types';
import { load } from '../constant';

// test
// http:ip:port/main-out
export const mainOutRoutes: AppRouteModule[] = [
  {
    path: '/main-out',
    name: 'MainOut',
    component: load(() => import('../../pages/main-out')),
    meta: {
      title: 'MainOut',
    },
  },
];

export const mainOutRouteNames = mainOutRoutes.map((item) => item.name);
