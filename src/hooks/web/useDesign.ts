import { useAppContainer } from '/@/hooks/core/useAppContext';

export function useDesign(scope: string) {
  const { prefixCls } = useAppContainer();
  return {
    prefixCls: `${prefixCls}-${scope}`,
    prefixVar: prefixCls,
  };
}
