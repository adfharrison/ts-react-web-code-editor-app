// enum to streamline setting action types in actions

export enum ActionType {
  MOVE_CELL = 'move_cell',
  DELETE_CELL = 'delete-cell',
  INSERT_CELL_AFTER = 'insert_cell_after',
  UPDATE_CELL = 'update_cell',
  BUNDLE_START = 'bundle_start',
  BUNDLE_COMPLETE = 'bundle_complete',
}
