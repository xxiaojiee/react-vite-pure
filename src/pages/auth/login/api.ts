import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel } from "./data";
import{ ErrorMessageMode } from '/#/axios';


export default {
  login(params: LoginParams, mode: ErrorMessageMode = 'modal') {
    return defHttp.post<LoginResultModel>(
      {
        url: '/login',
        params,
      },
      {
        errorMessageMode: mode,
      },
    );
  }
}
