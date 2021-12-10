export interface Person{
  id: number;
  name: string;
};

export default {
  id: 'user',
  state: {
    people: [{ id: 1, name: '小萝莉' }]
  },
  reducers: {
    addPerson(this: any, value: string) {
      const { people } = this.state;
      this.setCurrentState({
        people: people.concat([
          {
            id: parseInt((Math.random() * 1000000).toFixed(0), 10),
            name: value,
          },
        ])
      })
    },
    removePerson(this: any, value: string) {
      const { people } = this.state;
      this.setCurrentState({
        people: people.filter((person: Person) => person.id !== parseInt(value, 10))
      })
    },
  },
  methods: {
    dealData() {
      console.log('this:', this)
    }
  }
}

