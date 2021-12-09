import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, message } from 'antd';

import type { Person, AppState } from '/@/store/data.d';
import { removePerson, addPerson } from '/@/store/actions/index';

const Index: React.FC = () => {
  const [newPerson, setNewPerson] = React.useState('');
  const dispatch = useDispatch();
  const people: Person[] = useSelector((state: AppState) => state.people);
  console.log('people:', people);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const str = newPerson;
    str.replace(/\s+/g, '');

    if (!str) {
      message.warning('请输入有效字符');
      return;
    }

    dispatch(addPerson(newPerson));
    setNewPerson('');
  };

  return (
    <div>
      <div>
        <ul>
          {people.map((person) => (
            <li key={person.id}>
              <span>{person.name}</span>
              <button
                onClick={() => {
                  dispatch(removePerson(person.id));
                }}
              >
                删除
              </button>
            </li>
          ))}
        </ul>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="请输入名称"
            value={newPerson}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNewPerson(e.currentTarget.value);
            }}
          />
          <Button type="primary" htmlType="submit">
            添加
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Index;
