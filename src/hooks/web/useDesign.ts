import { useAppContainer } from '/@/components/Application';

export function useDesign(scope: string) {
  const { prefixCls } = useAppContainer();
  return {
    prefixCls: `${prefixCls}-${scope}`,
    prefixVar: prefixCls,
  };
}
