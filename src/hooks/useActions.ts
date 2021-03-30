import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../state/index';

export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(ActionCreators, dispatch);
};
