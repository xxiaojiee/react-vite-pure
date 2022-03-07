import { load } from '/@/router/constant';
import './src/index.less';


export const BasicModal = load(() => import('./src/BasicModal'));
export { useModal, useModalInner } from './src/hooks/useModal';


export * from './src/typing';
