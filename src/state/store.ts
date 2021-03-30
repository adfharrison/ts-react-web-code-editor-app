import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers/index';
import { ActionType } from './actionTypes/index';

export const store = createStore(reducers, {}, applyMiddleware(thunk));

store.dispatch({
  type: ActionType.INSERT_CELL_AFTER,
  payload: { id: null, type: 'code' },
});

store.dispatch({
  type: ActionType.INSERT_CELL_AFTER,
  payload: { id: null, type: 'text' },
});
store.dispatch({
  type: ActionType.INSERT_CELL_AFTER,
  payload: { id: null, type: 'code' },
});

store.dispatch({
  type: ActionType.INSERT_CELL_AFTER,
  payload: { id: null, type: 'text' },
});
