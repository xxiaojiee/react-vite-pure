import { addPerson, removePerson } from '../actions/index';
import type { Person } from '../data.d';
import actionTypes from '../actions/actionTypes';

type Actions = ReturnType<typeof addPerson> | ReturnType<typeof removePerson>;

const initialState: Person[] = [{ id: 1, name: '小萝莉' }];

export default function peopleReducer(state = initialState, action: Actions) {
  switch (action.type) {
    case actionTypes.ADD_PERSON:
      return state.concat([
        {
          id: parseInt((Math.random() * 1000000).toFixed(0), 10),
          name: action.payload,
        },
      ]);
    case actionTypes.REMOVE_PERSON:
      return state.filter((person) => person.id !== parseInt(action.payload, 10));
    default:
      break;
  }
  return state;
}
