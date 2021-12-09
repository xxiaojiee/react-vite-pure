
const components = import.meta.globEager("./*.mutation.ts");
const mutations = {};
const names = [];


for (const file of Object.keys(components)) {
  let defines;
  try {
      defines = components[file].default;
  } catch (e) {
      throw Error(`${file}:${e}`);
  }
  if (defines === undefined || typeof defines !== 'object') {
      throw Error(`${file}:内没有 export default 或者export default格式有误 `);
  } else if (typeof defines.mutations !== 'object') {
      throw Error(`${file}:缺少mutations属性或mutations属性不是对象`);
  }
  let name = defines.name;
  if (typeof name !== 'string') {
      throw Error(`${file}:缺少name属性`);
  }
  name = name.trim();
  if (names.includes(name)) {
      throw Error(`${file}:${name}此name已被使用`);
  } else {
      names.push(name);
  }
  mutations[name] = defines.mutations;
}

function reducers(state = {}, action) {
    if (typeof action.type === 'string' && /^\w+\.\w+$/.test(action.type)) {
        const namespace = action.type.split('.');
        return mutations[namespace[0]][namespace[1]](state, action);
    }
    return state;
}


export default reducers;
