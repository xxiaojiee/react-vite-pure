import { Persistent, BasicKeys } from '/@/utils/cache/persistent';
import { CacheTypeEnum, TOKEN_KEY, USER_INFO_KEY, ROLES_KEY } from '/@/enums/cacheEnum';
import projectSetting from '/@/settings/projectSetting';
import type { LocalValue } from '/@/utils/cache/persistent';

const { permissionCacheType } = projectSetting;
const isLocal = permissionCacheType === CacheTypeEnum.LOCAL;

export function getToken() {
  return getAuthCache(TOKEN_KEY);
}


export function getUserInfo() {
  return getAuthCache(USER_INFO_KEY);
}


export function getRoleList() {
  return getAuthCache(ROLES_KEY);
}

export function getAuthCache<T>(key: BasicKeys) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}

export function setAuthCache(key: BasicKeys, value: LocalValue) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
  return fn(key, value, true);
}
