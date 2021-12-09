
import type { AppState } from './data'

export default {
  id: 'user',
  state: {
    people: [{ id: 1, name: '小萝莉' }]
  },
  reducers: {
    addPerson(value) {
      this.setCurrentState({
        people: this.people.concat([
          {
            id: parseInt((Math.random() * 1000000).toFixed(0), 10),
            name: value,
          },
        ])
      })
    },
    removePerson(value) {
      this.setCurrentState({
        people: this.people.filter((person) => person.id !== parseInt(value, 10))
      })
    },
  },
  mdthods: {
    dealData() {

    }
  }
}

