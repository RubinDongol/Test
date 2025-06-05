import { Navigate, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { useEffect } from 'react';
import { notification } from 'antd';
import { setErrorMessage } from '../redux/reducers/auth';

const ProtectedRoute = () => {
  const dispatch = useAppDispatch();
  const { accessToken, errorMessage } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (errorMessage) {
      notification.error({ message: errorMessage });
      dispatch(setErrorMessage(''));
    }
  }, [errorMessage]);
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
