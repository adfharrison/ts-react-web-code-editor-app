import { ActionType } from '../actionTypes/index';
import { Action } from '../actions/index';
import { Cell } from '../cell';
import Produce from 'immer';

// interface to describe the cells portion of state
interface CellsState {
  loading: boolean;
  error: 'string' | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

// initialise state
const initialState: CellsState = {
  loading: false,
  error: null,
  // records the order in which the cells are displayed, will be an array of strings whch are the cell ids
  order: [],
  data: {},
};

// create reducer. we are going to use the Produce method from immer, which we wrap our reducer with.
// this basically automatically does all the spread state logic we need to not mutate the original state.
const cellsReducer = Produce(
  (state: CellsState = initialState, action: Action) => {
    switch (action.type) {
      case ActionType.MOVE_CELL:
        // destructure direction off payload
        const { direction } = action.payload;
        // find the index in the order array of the cell id we want to move, which comes off the payload
        const index = state.order.findIndex((id) => {
          return id === action.payload.id;
        });
        // set the index we would like to move the cell id to. if direction is up, we want it earlier, if not, later in the array
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        // make sure the target index will be within the array (i.e not -1 or greater than the last possible index)
        if (targetIndex < 0 || targetIndex > state.order.length - 1) {
          // if so, return early
          return state;
        }
        // replace the cell id at our given index with the one at where our payload cell id needs to go
        state.order[index] = state.order[targetIndex];
        // put our payload cell id where the target index is. we have now effectively swapped them round.
        state.order[targetIndex] = action.payload.id;
        return state;
      case ActionType.DELETE_CELL:
        // finds the object within data that matches the id from the payload, and deletes it
        delete state.data[action.payload];
        // filter through the order array in the state, find the string that matches the id on payload, and return new array without it
        state.order.filter((id) => {
          return id !== action.payload;
        });
        return state;
      case ActionType.INSERT_CELL_AFTER:
        const cell: Cell = {
          id: randomId(),
          type: action.payload.type,
          content: '',
        };

        // put our new cell into the state data object ,at key of our new cell id
        state.data[cell.id] = cell;

        // find the index where we want to insert the new cell. if we gave null, to insert at end, findIndex returns -1
        const insertIndex = state.order.findIndex((id) => {
          return id === action.payload.id;
        });

        if (insertIndex < 0) {
          // so if the given index was null, meaning we want to insert it at the very end of order array
          state.order.unshift(cell.id);
        } else {
          // splice our new index at the desired index
          state.order.splice(insertIndex + 1, 0, cell.id);
        }

        return state;
      case ActionType.UPDATE_CELL:
        // destructure id and content from the action payload
        const { id, content } = action.payload;
        // returns all other aspects of state except data (so keep loading, error, order). inside data we return all data objects except specifically
        // the one that matches the cell id in our action payload. we take that, retain all the data except the content (so keep the ID and cell type)
        // and replace the content of the cell with the content on the action payload
        state.data[id].content = content;
        return state;
      default:
        return state;
    }
  }
);
// random cell id generator
const randomId = () => {
  // random number to string, base 36 means letters and numbers, and the n take a small portion of it
  return Math.random().toString(36).substr(2, 5);
};

export default cellsReducer;
