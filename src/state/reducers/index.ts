import cellsReducer from '../reducers/cellsReducer';
import bundlesReducer from '../reducers/bundlesReducer';
import { combineReducers } from 'redux';

const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
