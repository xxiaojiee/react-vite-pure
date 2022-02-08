
import { load } from '/@/router/constant'

export const BasicDrawer = load(() => import('./src/BasicDrawer'));
export * from './src/typing';
export { useDrawer, useDrawerInner } from './src/useDrawer';
