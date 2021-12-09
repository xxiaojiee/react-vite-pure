import { addPerson, removePerson } from '../actions/index';
import type { AppState } from '../data'


type Actions = ReturnType<typeof addPerson> | ReturnType<typeof removePerson>;

// 变异状态 例子：
export default {
  name: 'user',
  mutations: {
    addPerson(state: AppState, action: Actions) {
      return {
        ...state,
        people: state.people.concat([
          {
            id: parseInt((Math.random() * 1000000).toFixed(0), 10),
            name: action.payload,
          },
        ])
      }
    },
    removePerson(state: AppState, action: Actions) {
      return {
        ...state,
        people: state.people.filter((person) => person.id !== parseInt(action.payload, 10))
      }
    },
  },
};



