
import { createStore } from 'redux';
import initialState from './initialState';
import type { Store } from 'redux';

const components = import.meta.globEager("./*.store.ts");
const mutations = {};
const ids = [];


for (const file of Object.keys(components)) {
  let defines;
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
      throw Error(`${file}:缺少name属性`);
  }
  id = id.trim();
  if (id.includes(id)) {
      throw Error(`${file}:${id}此id已被使用`);
  } else {
    ids.push(id);
  }
  mutations[id] = defines.reducers;
}

function reducers(state = {}, action) {
  if (typeof action.type === 'string' && /^\w+\.\w+$/.test(action.type)) {
      const namespace = action.type.split('.');
      return mutations[namespace[0]][namespace[1]](state, action);
  }
  return state;
}



export default function configureStore(): Store {
  return createStore(reducers, initialState);
}

