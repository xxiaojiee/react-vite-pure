import { defHttp } from '/@/utils/http/axios';
import { getMenuListResultModel } from './types/menu';

enum Api {
  GetMenuList = '/getMenuList',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList });
};
