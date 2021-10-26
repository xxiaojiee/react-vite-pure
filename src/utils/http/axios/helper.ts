import { isObject, isString } from '/@/utils/is';


// export function joinTimestamp<T extends boolean>(
//   join: boolean,
//   restful: T,
// ): T extends true ? string : object;


export function joinTimestamp(join: boolean, restful = false): string | object {
  if (!join) {
    return restful ? '' : {};
  }
  const now = new Date().getTime();
  if (restful) {
    return `?_t=${now}`;
  }
  return { _t: now };
}


/**
 * @description: 格式请求参数时间
 */
export function formatRequestDate(params: any) {
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      // _isAMomentObject 判断是否为MOMENT时间对象
      if (params[key] && params[key]._isAMomentObject) {
        params[key] = params[key].format(DATE_TIME_FORMAT);
      }
      if (isString(key)) {
        const value = params[key];
        if (value) {
          try {
            params[key] = isString(value) ? value.trim() : value;
          } catch (error) {
            throw new Error(error as string)
          }
        }
      }
      if (isObject(params[key])) {
        formatRequestDate(params[key]);
      }
    }
  }
}
