import { combineReducers, createStore } from 'redux';
import type { Store } from 'redux';
import type { AppState } from './data.d';

import peopleReducer from './reducers/index';

const rootReducer = combineReducers<AppState>({
  people: peopleReducer,
});

function configureStore(): Store<AppState> {
  const store = createStore(rootReducer, undefined);
  return store;
}

const storeData = configureStore();

export default storeData;
