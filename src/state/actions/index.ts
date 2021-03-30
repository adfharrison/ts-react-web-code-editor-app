import { ActionType } from '../actionTypes/index';
import { CellTypes } from '../cell';

export type Direction = 'up' | 'down';
// use Action Type enum to set types and contents of actions
export interface MoveCellAction {
  type: ActionType.MOVE_CELL;
  // cell id to move, direction to move
  payload: {
    id: string;
    direction: Direction;
  };
}
export interface DeleteCellACtion {
  type: ActionType.DELETE_CELL;
  // cell id to delete
  payload: string;
}
export interface InsertCellAfterAction {
  type: ActionType.INSERT_CELL_AFTER;
  // id of cell to insert before, type of cell we want to insert
  payload: {
    id: string | null;
    type: CellTypes;
  };
}
export interface UpdateCellAction {
  type: ActionType.UPDATE_CELL;
  // id of cell to update, and new content
  payload: {
    id: string;
    content: string;
  };
}

export interface BundleStartAction {
  type: ActionType.BUNDLE_START;
  payload: {
    // id of cell we are getting the code from
    cellId: string;
  };
}

export interface BundleCompleteAction {
  type: ActionType.BUNDLE_COMPLETE;
  payload: {
    cellId: string;
    bundle: {
      code: string;
      err: string;
    };
  };
}
// create a global Action type using union of all these interfaces
export type Action =
  | MoveCellAction
  | DeleteCellACtion
  | InsertCellAfterAction
  | UpdateCellAction
  | BundleStartAction
  | BundleCompleteAction;
