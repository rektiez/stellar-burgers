import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { loginUser } from '../../services/slices/user-slice';
import { useDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { useNavigate, useLocation } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const errorText = useSelector((state: RootState) => state.user.error);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
    return null;
  }

  return (
    <LoginUI
      errorText={errorText || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
