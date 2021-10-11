// 存在内存和Storage中的缓存的Key

// token key
// 存在内存中的token的Key
// 具体是哪一种内存要看/@/settings/projectSetting中的permissionCacheType
export const TOKEN_KEY = 'TOKEN__';

// 存在LocalStorage中的国际化对象Key
export const LOCALE_KEY = 'LOCALE__';

// user info key
// 存在内存中的用户信息Key
// 具体是哪一种内存要看/@/settings/projectSetting中的permissionCacheType
export const USER_INFO_KEY = 'USER__INFO__';

// role info key
// 存在内存中的角色信息Key
// 具体是哪一种内存要看/@/settings/projectSetting中的permissionCacheType
export const ROLES_KEY = 'ROLES__KEY__';

// project config key
// 存在LocalStorage内存中的项目
export const PROJ_CFG_KEY = 'PROJ__CFG__KEY__';

// lock info
// 存在LocalStorage内存中的锁屏信息
export const LOCK_INFO_KEY = 'LOCK__INFO__KEY__';

export const MULTIPLE_TABS_KEY = 'MULTIPLE_TABS__KEY__';

export const APP_DARK_MODE_KEY_ = '__APP__DARK__MODE__';

// base global local key
// 存在LocalStorage中缓存的Key
export const APP_LOCAL_CACHE_KEY = 'COMMON__LOCAL__KEY__';

// base global session key
// 存在SessionStorage中缓存的Key
export const APP_SESSION_CACHE_KEY = 'COMMON__SESSION__KEY__';

// 缓存的类型
export enum CacheTypeEnum {
  SESSION,
  LOCAL,
}
