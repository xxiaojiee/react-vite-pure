import type { LockInfo } from '/#/store';
import { LOCK_INFO_KEY } from '/@/enums/cacheEnum';
import { Persistent } from '/@/utils/cache/persistent';

export interface LockState {
  lockInfo: Nullable<LockInfo>;
}


export default {
  id: 'lock',
  state: {
    lockInfo: Persistent.getLocal(LOCK_INFO_KEY),
  },
  reducers: {
    setLockInfo(this: any,info: LockInfo) {
      const lockInfo = Object.assign({}, this.state.lockInfo, info);
      this.setCurrentState({
        lockInfo
      })
      Persistent.setLocal(LOCK_INFO_KEY, lockInfo, true);
    },
    resetLockInfo(this: any) {
      Persistent.removeLocal(LOCK_INFO_KEY);
      this.setCurrentState({
        lockInfo:null,
      })
    },
  },
  // methods: {
  //   dealData() {
  //     console.log('this:', this)
  //   }
  // }
}

