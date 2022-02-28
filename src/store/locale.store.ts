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
      const newLocalInfo = { ...this.state.localInfo, ...info }
      this.setCurrentState({
        localInfo: newLocalInfo
      })
      ls.set(LOCALE_KEY, newLocalInfo);
    },
    /**
     * 初始化多语言信息并从本地缓存加载现有配置
     */
    initLocale(this: any) {
      const newLocalInfo = {
        ...localeSetting,
        ...this.state.localInfo,
      }
      this.setCurrentState({
        localInfo: newLocalInfo
      })
      ls.set(LOCALE_KEY, newLocalInfo);
    },
  },
  // methods: {
  //   dealData() {
  //   }
  // }
}
