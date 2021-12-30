import type {
  ProjectConfig,
} from '/#/config';
import type { BeforeMiniState } from '/#/store';

import { ThemeEnum } from '/@/enums/appEnum';
import { APP_DARK_MODE_KEY_, PROJ_CFG_KEY } from '/@/enums/cacheEnum';
import { Persistent } from '/@/utils/cache/persistent';
import { darkMode } from '/@/settings/designSetting';
import { deepMerge } from '/@/utils';

export interface AppState {
  darkMode?: ThemeEnum;
  // Page loading status
  pageLoading: boolean;
  // project config
  projectConfig: ProjectConfig | null;
  // When the window shrinks, remember some states, and restore these states when the window is restored
  beforeMiniInfo: BeforeMiniState;
}

// let timeId: TimeoutHandle;

export default {
  id: 'app',
  state: {
    darkMode: undefined,
    pageLoading: false,
    projectConfig: Persistent.getLocal(PROJ_CFG_KEY),
    beforeMiniInfo: {},
  },
  reducers: {
    setPageLoading(this: any, loading: boolean): void {
      this.setCurrentState({
        pageLoading: loading
      })
    },

    setDarkMode(this: any, mode: ThemeEnum): void {
      this.setCurrentState({
        darkMode: mode || localStorage.getItem(APP_DARK_MODE_KEY_) || darkMode
      })
      localStorage.setItem(APP_DARK_MODE_KEY_, mode);
    },

    setBeforeMiniInfo(this: any, state: BeforeMiniState): void {
      this.setCurrentState({
        beforeMiniInfo: state
      })
    },
    setProjectConfig(this: any, config: DeepPartial<ProjectConfig>): void {
      const newConfig = deepMerge(this.state.projectConfig || {}, config);
      this.setCurrentState({
        projectConfig: newConfig,
      })
      Persistent.setLocal(PROJ_CFG_KEY, newConfig);
    },

  },
  // methods: {
  //   dealData() {
  //     console.log('this:', this)
  //   }
  // }
}

