// 用户的字段类型
export type Person = {
  id: number;
  name: string;
};

// 所有用户的类型
export type AppState = {
  people: Person[];
};
