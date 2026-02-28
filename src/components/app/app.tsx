import { useEffect } from 'react';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useMatch
} from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { AccessMode, ProtectedRoute } from '../protected-route/protected-route';
import { clearError } from '../../services/slices/user-slice';

import { useDispatch } from '../../services/store';
import { fetchUser } from '../../services/slices/user-slice';
import { fetchIngredients } from '../../services/slices/ingridients-slice';

import '../../index.css';
import styles from './app.module.css';

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const background = location.state?.background;

  const feedOrderMatch = useMatch('/feed/:number');
  const profileOrderMatch = useMatch('/profile/orders/:number');
  const orderNumber =
    feedOrderMatch?.params.number || profileOrderMatch?.params.number;

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearError());
  }, [location.pathname, dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />

        <Route path='/feed'>
          <Route index element={<Feed />} />
          <Route path=':number' element={<OrderInfo />} />
        </Route>

        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute accessMode={AccessMode.UnauthenticatedOnly}>
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path='/register'
          element={
            <ProtectedRoute accessMode={AccessMode.UnauthenticatedOnly}>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute accessMode={AccessMode.UnauthenticatedOnly}>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/reset-password'
          element={
            <ProtectedRoute accessMode={AccessMode.UnauthenticatedOnly}>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route path='/profile'>
          <Route
            index
            element={
              <ProtectedRoute accessMode={AccessMode.AuthenticatedOnly}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path='orders'
            element={
              <ProtectedRoute accessMode={AccessMode.AuthenticatedOnly}>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path='orders/:number'
            element={
              <ProtectedRoute accessMode={AccessMode.AuthenticatedOnly}>
                <OrderInfo />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={`#${orderNumber}`} onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute accessMode={AccessMode.AuthenticatedOnly}>
                <Modal title={`#${orderNumber}`} onClose={() => navigate(-1)}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
