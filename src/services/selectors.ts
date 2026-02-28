import { RootState } from './store';

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isIngredientsLoading;

export const selectConstructor = (state: RootState) => state.burgerConstructor;
export const selectConstructorBun = (state: RootState) =>
  state.burgerConstructor.bun;
export const selectConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;

export const selectOrder = (state: RootState) => state.order;
export const selectOrderData = (state: RootState) => state.order.orderData;
export const selectCurrentOrder = (state: RootState) =>
  state.order.currentOrder;
export const selectOrderLoading = (state: RootState) => state.order.loading;

export const selectUser = (state: RootState) => state.user.user;
export const selectAuthChecked = (state: RootState) => state.user.isAuthChecked;
export const getUserState = (state: RootState) => state.user;
