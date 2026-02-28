import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';

import { getUserState } from '@selectors';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import {
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData,
  makeOrder,
  clearOrderModal
} from '../../services/slices/constructor-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, ingredients } = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const isAuthenticated = useSelector(getUserState).isAuthenticated;

  const ingredientIds = useMemo(
    () => ingredients.map((item: TConstructorIngredient) => item._id),
    [ingredients]
  );

  const orderIngredientIds = useMemo(() => {
    if (!bun) return null;
    return [bun._id, ...ingredientIds, bun._id];
  }, [bun, ingredientIds]);

  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!orderIngredientIds || orderRequest) {
      return;
    }

    dispatch(makeOrder(orderIngredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
