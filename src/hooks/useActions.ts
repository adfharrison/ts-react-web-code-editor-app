import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../state/index';
import { useMemo } from 'react';

export const useActions = () => {
  const dispatch = useDispatch();

  // useMEmo ensures we only ever do this binding one time
  return useMemo(() => {
    return bindActionCreators(ActionCreators, dispatch);
  }, [dispatch]);
};
