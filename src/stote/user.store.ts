
import type { AppState } from './data'



export default {
  id: 'user',
  state: {
    people: [{ id: 1, name: '小萝莉' }]
  },
  getters: {

  },
  reducers: {
    addPerson(state: AppState, action) {
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
    removePerson(state: AppState, action) {
      return {
        ...state,
        people: state.people.filter((person) => person.id !== parseInt(action.payload, 10))
      }
    },
  },
}

