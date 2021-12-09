
export const addPerson = (personName: string) => {
  return {
    type: 'user.addPerson',
    payload: personName,
  } as const;
};

export const removePerson = (id: string) => {
  return {
    type: 'user.removePerson',
    payload: id,
  } as const;
};
