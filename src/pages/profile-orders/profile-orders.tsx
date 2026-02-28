import { getOrders } from '../../services/slices/order-slice';
import { useDispatch, useSelector } from '../../services/store';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector((state) => state.order.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
