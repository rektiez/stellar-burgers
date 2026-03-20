import '@testing-library/jest-dom';
import { rootReducer } from './root-reducer';

describe('rootReducer', () => {
  it('должен правильно инициализироваться со всеми слайсами', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    expect(state).toBeDefined();
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('user');
  });

  describe('ingredients slice', () => {
    it('должен иметь правильное начальное состояние', () => {
      const state = rootReducer(undefined, { type: '@@INIT' });

      expect(state.ingredients).toEqual({
        ingredients: [],
        isIngredientsLoading: false,
        error: null
      });
    });
  });

  describe('burgerConstructor slice', () => {
    it('должен иметь правильное начальное состояние', () => {
      const state = rootReducer(undefined, { type: '@@INIT' });

      expect(state.burgerConstructor).toEqual({
        bun: null,
        ingredients: [],
        orderRequest: false,
        orderModalData: null,
        error: null
      });
    });
  });

  describe('order slice', () => {
    it('должен иметь правильное начальное состояние', () => {
      const state = rootReducer(undefined, { type: '@@INIT' });

      expect(state.order).toEqual({
        orderData: null,
        orderNumber: null,
        loading: false,
        error: null,
        orders: [],
        total: 0,
        totalToday: 0,
        currentOrder: null
      });
    });
  });

  describe('user slice', () => {
    it('должен иметь правильное начальное состояние', () => {
      const state = rootReducer(undefined, { type: '@@INIT' });

      expect(state.user).toEqual({
        user: null,
        loading: false,
        error: null,
        isAuthChecked: false,
        isAuthenticated: false
      });
    });
  });

  describe('интеграционные тесты', () => {
    it('должен обрабатывать экшен неизвестного типа', () => {
      const initialState = rootReducer(undefined, { type: '@@INIT' });
      const newState = rootReducer(initialState, { type: 'UNKNOWN_ACTION' });

      expect(newState).toEqual(initialState);
    });

    it('должен обновлять только нужный слайс при экшене', () => {
      const initialState = rootReducer(undefined, { type: '@@INIT' });
      
      const newState = rootReducer(initialState, { 
        type: 'ingredients/fetchAll/pending' 
      });

      expect(newState.ingredients.isIngredientsLoading).toBe(true);
      
      expect(newState.burgerConstructor).toEqual(initialState.burgerConstructor);
      expect(newState.order).toEqual(initialState.order);
      expect(newState.user).toEqual(initialState.user);
    });
  });
});