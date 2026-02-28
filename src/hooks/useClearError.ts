import { useEffect } from 'react';
import { useDispatch } from '../services/store';
import { useLocation } from 'react-router-dom';
import { clearError } from '../services/slices/user-slice';

export const useClearError = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(clearError());
  }, [location.pathname, dispatch]);
};
