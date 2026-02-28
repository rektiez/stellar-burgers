import { getFeeds } from '../../services/slices/order-slice';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector((state) => state.order.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeeds());
      }}
    />
  );
};
