import type { ErrorLogInfo } from '/#/store';

import { formatToDateTime } from '/@/utils/dateUtil';
import projectSetting from '/@/settings/projectSetting';

import { ErrorTypeEnum } from '/@/enums/exceptionEnum';

export interface ErrorLogState {
  errorLogInfoList: Nullable<ErrorLogInfo[]>;
  errorLogListCount: number;
}

export default {
  id: 'errorLog',
  state: {
    errorLogInfoList: null,
    errorLogListCount: 0,
  },
  reducers: {
    addErrorLogInfo(this: any, info: ErrorLogInfo) {
      const item = {
        ...info,
        time: formatToDateTime(new Date()),
      };
      this.setCurrentState({
        errorLogInfoList: [item, ...(this.state.errorLogInfoList || [])],
        errorLogListCount: (this.state.errorLogListCount as number) + 1,
      })
    },

    setErrorLogListCount(this: any, count: number): void {
      this.setCurrentState({
        errorLogListCount: count,
      })
    },

    /**
     * Triggered after ajax request error
     * @param error
     * @returns
     */
    addAjaxErrorInfo(this: any, error) {
      const { useErrorHandle } = projectSetting;
      if (!useErrorHandle) {
        return;
      }
      const errInfo: Partial<ErrorLogInfo> = {
        message: error.message,
        type: ErrorTypeEnum.AJAX,
        time: formatToDateTime(new Date()),
      };
      if (error.response) {
        const {
          config: { url = '', data: params = '', method = 'get', headers = {} } = {},
          data = {},
        } = error.response;
        errInfo.url = url;
        errInfo.name = 'Ajax Error!';
        errInfo.file = '-';
        errInfo.stack = JSON.stringify(data);
        errInfo.detail = JSON.stringify({ params, method, headers });
      }
      this.setCurrentState({
        errorLogInfoList: [errInfo, ...(this.state.errorLogInfoList || [])],
        errorLogListCount: (this.state.errorLogListCount as number) + 1,
      })
    },
  },
  // methods: {
  //   dealData() {
  //   }
  // }
}

