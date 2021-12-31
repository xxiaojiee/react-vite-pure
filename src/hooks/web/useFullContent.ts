import { computed, unref } from 'vue';

import { useStoreState } from '/@/store';

import { useRouter } from 'vue-router';

/**
 * @description: Full screen display content
 */
export const useFullContent = () => {
  const appState = useStoreState('app');
  const router = useRouter();
  const { currentRoute } = router;

  // Whether to display the content in full screen without displaying the menu
  const getFullContent = () => {
    // Query parameters, the full screen is displayed when the address bar has a full parameter
    const route = currentRoute;
    const query = route.query;
    if (query && Reflect.has(query, '__full__')) {
      return true;
    }
    // Return to the configuration in the configuration file
    return appState.projectConfig?.fullContent;
  };

  return { getFullContent };
};
