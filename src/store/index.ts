
import { createStore } from 'redux';
import type { Store } from 'redux';
import { useSelector } from 'react-redux';
import { get } from 'lodash-es';

interface ObjectType {
  [index: string]: any
}

const components = import.meta.globEager("./*.store.ts");
const ids: string[] = [];
const reducers: ObjectType = {};
const initialState: ObjectType = {};
const allActions: ObjectType = {};
const methods: ObjectType = {};

for (const file of Object.keys(components)) {
  let defines;
  const componentAction: ObjectType = {}
  try {
    defines = components[file].default;
  } catch (e) {
    throw Error(`${file}:${e}`);
  }
  if (defines === undefined || typeof defines !== 'object') {
    throw Error(`${file}:内没有 export default 或者export default格式有误 `);
  }
  let { id } = defines;
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
  reducers[id] = defines.reducers || {};
  methods[id] = defines.methods || {};
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

function rootReducer(state = initialState, action) {
  if (typeof action.type === 'string' && /^\w+\.\w+$/.test(action.type)) {
    const [id, reducer] = action.type.split('.');
    let newState = {};
    // 改变当前文件中state
    const setCurrentState = (data: ObjectType) => {
      newState = {
        ...state,
        [id]: {
          ...state[id],
          ...data,
        }
      }
    }
    // 改变全局state
    const setState = (data: ObjectType) => {
      newState = data;
    }
    const tool: ObjectType = {
      id,
      state: state[id],
      setState,
      setCurrentState,
    };
    Object.keys(methods[id]).forEach((keys) => {
      tool[keys] = function (...agument: any) {
        methods[id][keys].call(tool, ...agument);
      }
    })
    const allState = reducers[id][reducer].call(tool, action.payload, state);
    if (!newState && !allState) {
      throw Error(`${action.type}:方法内没有返回值，也没有调用“setState”和“setCurrentState” 方法`);
    }
    return newState || allState || state;
  }
  return state;
}


export const store: Store = createStore(rootReducer, initialState);


export const actions = allActions;

export const useStoreState = (key: string) => {
  return useSelector((state: Record<string, any>) => get(state, key));

}
