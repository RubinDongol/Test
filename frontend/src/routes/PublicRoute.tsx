import { Navigate, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { useEffect } from 'react';
import { setErrorMessage } from '../redux/reducers/auth';
import { notification } from 'antd';

const PublicRoute = () => {
  const dispatch = useAppDispatch();
  const { accessToken, errorMessage } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (errorMessage) {
      notification.error({ message: errorMessage });
      dispatch(setErrorMessage(''));
    }
  }, [errorMessage]);

  return accessToken ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
