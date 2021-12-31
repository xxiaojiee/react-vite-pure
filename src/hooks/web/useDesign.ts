import { useAppContainer } from '/@/components/Application';

export function useDesign(scope: string) {
  const { app } = useAppContainer();
  return {
    prefixCls: `${app.prefixCls}-${scope}`,
    prefixVar: app.prefixCls,
  };
}
