import { createStore } from 'redux';
import rootReducer from './reducers';
import initialState from './initialState';
import type { Store } from 'redux';

export default function configureStore(): Store {
  return createStore(rootReducer, initialState);
}

