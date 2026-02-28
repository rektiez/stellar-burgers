import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { RegisterUI } from '@ui-pages';
import { registerUser } from '../../services/slices/user-slice';
import { useDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { useNavigate, useLocation } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
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
    if (!userName || !email || !password) {
      return;
    }
    dispatch(registerUser({ email, name: userName, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  return (
    <RegisterUI
      errorText={errorText || ''}
      userName={userName}
      setUserName={setUserName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
