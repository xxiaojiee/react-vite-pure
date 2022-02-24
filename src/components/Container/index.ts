import { load } from '/@/router/constant';

export const CollapseContainer = load(() => import('./src/collapse/CollapseContainer'));
export const ScrollContainer = load(() => import('./src/ScrollContainer'));
export const LazyContainer = load(() => import('./src/LazyContainer'));


export * from './src/typing';
