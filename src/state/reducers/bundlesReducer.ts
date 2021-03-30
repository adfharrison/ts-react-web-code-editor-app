import Produce from 'immer';
import { ActionType } from '../actionTypes/index';
import { Action } from '../actions/index';

// interface to describe the bundles portion of state
interface BundlesState {
  [key: string]:
    | {
        loading: boolean;
        err: string;
        code: string;
      }
    | undefined;
}
// initialise state
const initialState: BundlesState = {};

// create reducer. we are going to use the Produce method from immer, which we wrap our reducer with.
// this basically automatically does all the spread state logic we need to not mutate the original state.
const reducer = Produce(
  (state: BundlesState = initialState, action: Action): BundlesState => {
    switch (action.type) {
      case ActionType.BUNDLE_START:
        // this basically throws away any existing value for this cell's code and data
        state[action.payload.cellId] = {
          loading: true,
          code: '',
          err: '',
        };
        return state;
      case ActionType.BUNDLE_COMPLETE:
        // this applies the bundled code to our cell's code prop and switches the other props too
        state[action.payload.cellId] = {
          loading: false,
          code: action.payload.bundle.code,
          err: action.payload.bundle.err,
        };
        return state;
      default:
        return state;
    }
  }
);

export default reducer;
