import { ActionType } from '../actionTypes/index';
import { Dispatch } from 'redux';
import bundle from '../../bundler/index';
import {
  Action,
  UpdateCellAction,
  InsertCellAfterAction,
  DeleteCellACtion,
  MoveCellAction,
} from '../actions/index';
import { Direction } from '../actions/index';

import { CellTypes } from '../cell';

// these are the action creators, they are called within our react app.
// they take data from react, apply it to the payload, apply an action type and this
// is all then used in our reducer
export const updateCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: { id, content },
  };
};

export const deleteCell = (id: string): DeleteCellACtion => {
  return {
    type: ActionType.DELETE_CELL,
    payload: id,
  };
};

export const moveCell = (id: string, direction: Direction): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: {
      id,
      direction,
    },
  };
};

export const insertCellAfter = (
  id: string | null,
  cellType: CellTypes
): InsertCellAfterAction => {
  return {
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
      id,
      type: cellType,
    },
  };
};

// this action creator is asyncronous and so needs to implement dispatch
export const createBundle = (id: string, input: string) => {
  return async (dispatch: Dispatch<Action>) => {
    // wipe the state for this cell
    dispatch({
      type: ActionType.BUNDLE_START,
      payload: {
        cellId: id,
      },
    });

    // start the bundling process
    const result = await bundle(input);

    // apply the result to this cell's state
    dispatch({
      type: ActionType.BUNDLE_COMPLETE,
      payload: {
        cellId: id,
        bundle: result,
      },
    });
  };
};
