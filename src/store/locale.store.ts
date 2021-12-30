import type { LocaleSetting } from '/#/config';

import { LOCALE_KEY } from '/@/enums/cacheEnum';
import { createLocalStorage } from '/@/utils/cache';
import { localeSetting } from '/@/settings/localeSetting';

const ls = createLocalStorage();

const lsLocaleSetting = (ls.get(LOCALE_KEY) || localeSetting) as LocaleSetting;

export interface LocaleState {
  localInfo: LocaleSetting;
}

export default {
  id: 'locale',
  state: {
    localInfo: lsLocaleSetting,
  },
  reducers: {
    setPageLoading(this: any, loading: boolean): void {
      this.setCurrentState({
        pageLoading: loading
      })
    },

    /**
     * 设置多语言信息和缓存
     * @param info multilingual info
     */
    setLocaleInfo(this: any, info: Partial<LocaleSetting>) {
      this.setCurrentState({
        localInfo: { ...this.localInfo, ...info }
      })
      ls.set(LOCALE_KEY, this.localInfo);
    },
    /**
     * 初始化多语言信息并从本地缓存加载现有配置
     */
    initLocale(this: any) {
      this.setLocaleInfo({
        ...localeSetting,
        ...this.state.localInfo,
      });
    },
  },
  // methods: {
  //   dealData() {
  //     console.log('this:', this)
  //   }
  // }
}
