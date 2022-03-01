
import { useAppContainer } from '/@/hooks/core/useAppContext';

export function useAppInject() {
  const { isMobile } = useAppContainer();
  return {
    getIsMobile: () => isMobile,
  };
}
