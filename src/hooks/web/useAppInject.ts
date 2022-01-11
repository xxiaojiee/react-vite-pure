import { useAppContainer } from '/@/components/Application';


export function useAppInject() {
  const {app} = useAppContainer();
  return {
    getIsMobile: () => app.isMobile,
  };
}
