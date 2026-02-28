import { useSelector } from '../../services/store';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { FC } from 'react';
import { selectOrder } from '@selectors';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orderState = useSelector(selectOrder);

  const orders: TOrder[] = orderState.orders;
  const feed = {
    total: orderState.total,
    totalToday: orderState.totalToday
  };

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
