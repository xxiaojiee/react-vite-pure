
import { createStore } from 'redux';
import type { Store } from 'redux';

const components = import.meta.globEager("./*.store.ts");
const mutations = {};
const ids = [];
const initialState = {};
const allActions = {};

for (const file of Object.keys(components)) {
  let defines;
  const componentAction = {}
  try {
    defines = components[file].default;
  } catch (e) {
    throw Error(`${file}:${e}`);
  }
  if (defines === undefined || typeof defines !== 'object') {
    throw Error(`${file}:内没有 export default 或者export default格式有误 `);
  }
  let id = defines.id;
  if (typeof id !== 'string') {
    throw Error(`${file}:缺少id属性`);
  }
  id = id.trim();
  if (ids.includes(id)) {
    throw Error(`${file}:${id}此id已被使用`);
  } else {
    ids.push(id);
  }
  initialState[id] = defines.state || {};
  mutations[id] = defines.reducers || {};
  Object.keys(defines.reducers).forEach((key) => {
    componentAction[key] = (val: any) => {
      return {
        type: `${id}.${key}`,
        payload: val,
      } as const;
    };
  })
  allActions[id] = componentAction;
}

function reducers(state = initialState, action) {
  if (typeof action.type === 'string' && /^\w+\.\w+$/.test(action.type)) {
    const [id, reducer] = action.type.split('.');
    let newState = null;
    // 改变当前文件中state
    const setCurrentState = (data) => {
      newState = {
        ...state,
        [id]: {
          ...state[id],
          ...data,
        }
      }
    }
    // 改变全局state
    const setState = (data) => {
      newState = data;
    }
    const tool = {
      state,
      ...state[id],
      setState,
      setCurrentState,
    };
    const allState = mutations[id][reducer].call(tool, action.payload, state);
    if(!newState && !allState){
      throw Error(`${action.type}:方法内没有返回值，也没有调用“setState”和“setCurrentState” 方法`);
    }
    return newState || allState || state;
  }
  return state;
}


export const store: Store = createStore(reducers, initialState);


export const actions = allActions;
