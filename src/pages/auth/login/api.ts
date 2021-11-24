import { defHttp } from '/@/utils/http/axios';
import type { LoginParams } from "./data";

export interface GetAccountInfoModel {
  email: string;
  name: string;
  introduction: string;
  phone: string;
  address: string;
}

export default {
  login(params: LoginParams) {
    return defHttp.get<GetAccountInfoModel>({ url: '/account/getAccountInfo' });
  }
}
