import '@testing-library/jest-dom';
import { rootReducer } from './root-reducer';

const ACTION_TYPES = {
  INIT: '@@INIT',
  UNKNOWN: 'UNKNOWN_ACTION',
} as const;

const SLICE_KEYS = {
  INGREDIENTS: 'ingredients',
  BURGER_CONSTRUCTOR: 'burgerConstructor',
  ORDER: 'order',
  USER: 'user',
} as const;

const INITIAL_STATES = {
  INGREDIENTS: {
    ingredients: [],
    isIngredientsLoading: false,
    error: null,
  },
  BURGER_CONSTRUCTOR: {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null,
    error: null,
  },
  ORDER: {
    orderData: null,
    orderNumber: null,
    loading: false,
    error: null,
    orders: [],
    total: 0,
    totalToday: 0,
    currentOrder: null,
  },
  USER: {
    user: null,
    loading: false,
    error: null,
    isAuthChecked: false,
    isAuthenticated: false,
  },
} as const;

describe('rootReducer', () => {
  it('должен правильно инициализироваться со всеми слайсами', () => {
    const state = rootReducer(undefined, { type: ACTION_TYPES.INIT });

    expect(state).toBeDefined();
    expect(state).toHaveProperty(SLICE_KEYS.INGREDIENTS);
    expect(state).toHaveProperty(SLICE_KEYS.BURGER_CONSTRUCTOR);
    expect(state).toHaveProperty(SLICE_KEYS.ORDER);
    expect(state).toHaveProperty(SLICE_KEYS.USER);
  });

  describe('ingredients slice', () => {
    it('должен иметь правильное начальное состояние', () => {
      const state = rootReducer(undefined, { type: ACTION_TYPES.INIT });

      expect(state[SLICE_KEYS.INGREDIENTS]).toEqual(INITIAL_STATES.INGREDIENTS);
    });
  });

  describe('burgerConstructor slice', () => {
    it('должен иметь правильное начальное состояние', () => {
      const state = rootReducer(undefined, { type: ACTION_TYPES.INIT });

      expect(state[SLICE_KEYS.BURGER_CONSTRUCTOR]).toEqual(
        INITIAL_STATES.BURGER_CONSTRUCTOR
      );
    });
  });

  describe('order slice', () => {
    it('должен иметь правильное начальное состояние', () => {
      const state = rootReducer(undefined, { type: ACTION_TYPES.INIT });

      expect(state[SLICE_KEYS.ORDER]).toEqual(INITIAL_STATES.ORDER);
    });
  });

  describe('user slice', () => {
    it('должен иметь правильное начальное состояние', () => {
      const state = rootReducer(undefined, { type: ACTION_TYPES.INIT });

      expect(state[SLICE_KEYS.USER]).toEqual(INITIAL_STATES.USER);
    });
  });

  describe('интеграционные тесты', () => {
    it('должен обрабатывать экшен неизвестного типа', () => {
      const initialState = rootReducer(undefined, { type: ACTION_TYPES.INIT });
      const newState = rootReducer(initialState, { type: ACTION_TYPES.UNKNOWN });

      expect(newState).toEqual(initialState);
    });

    it('должен обновлять только нужный слайс при экшене', () => {
      const initialState = rootReducer(undefined, { type: ACTION_TYPES.INIT });

      const newState = rootReducer(initialState, {
        type: 'ingredients/fetchAll/pending',
      });

      expect(newState[SLICE_KEYS.INGREDIENTS].isIngredientsLoading).toBe(true);

      expect(newState[SLICE_KEYS.BURGER_CONSTRUCTOR]).toEqual(
        initialState[SLICE_KEYS.BURGER_CONSTRUCTOR]
      );
      expect(newState[SLICE_KEYS.ORDER]).toEqual(initialState[SLICE_KEYS.ORDER]);
      expect(newState[SLICE_KEYS.USER]).toEqual(initialState[SLICE_KEYS.USER]);
    });
  });
});