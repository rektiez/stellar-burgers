import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { RootState } from 'src/services/store';

export enum AccessMode {
  AuthenticatedOnly,
  UnauthenticatedOnly
}

type ProtectedRouteProps = {
  children: React.ReactElement;
  accessMode?: AccessMode;
};

const selectUserState = (state: RootState) => ({
  user: state.user.user,
  isAuthChecked: state.user.isAuthChecked
});

export const ProtectedRoute = ({
  children,
  accessMode = AccessMode.AuthenticatedOnly
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, isAuthChecked } = useSelector(selectUserState);

  if (!isAuthChecked) {
    return <p>Загрузка...</p>;
  }

  const isAuthenticated = !!user;

  if (accessMode === AccessMode.AuthenticatedOnly && !isAuthenticated) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (accessMode === AccessMode.UnauthenticatedOnly && isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate replace to={from} />;
  }

  return children;
};
