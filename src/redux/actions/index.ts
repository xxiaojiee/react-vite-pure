// src/redux/actions/index.ts

import actionTypes from './actionTypes';

export const addPerson = (personName: string) => {
  return {
    type: actionTypes.ADD_PERSON,
    payload: personName,
  } as const;
};

export const removePerson = (id: string) => {
  return {
    type: actionTypes.REMOVE_PERSON,
    payload: id,
  } as const;
};
