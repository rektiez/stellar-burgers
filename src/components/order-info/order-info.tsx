import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';

import { TIngredient } from '@utils-types';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';

import {
  getOrderByNumber,
  clearCurrentOrder
} from '../../services/slices/order-slice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const orderData = useSelector((state) => state.order.currentOrder);
  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.ingredients
  );

  useEffect(() => {
    if (number) {
      dispatch(getOrderByNumber(Number(number)));
    }

    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [number, dispatch]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
