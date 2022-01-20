import { useAppContainer } from '/@/components/Application';


export function useAppInject() {
  const { isMobile } = useAppContainer();
  return {
    getIsMobile: () => isMobile,
  };
}
