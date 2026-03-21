import '@testing-library/jest-dom';
import ordersReducer, {
  clearOrder,
  clearCurrentOrder,
  createOrder,
  getFeeds,
  getOrders,
  getOrderByNumber,
  initialState
} from './order-slice';
import { TOrder } from '../../utils/types';

const ERROR_MESSAGES = {
  PREVIOUS: 'Предыдущая ошибка',
  GENERIC: 'Some error',
  CREATE_ORDER: 'Ошибка заказа',
  FEEDS: 'Ошибка загрузки лент',
  ORDERS: 'Ошибка загрузки заказов',
  NOT_FOUND: 'Заказ не найден',
  NETWORK: 'Network error',
} as const;

const ORDER_DATA = {
  ID: '6789abcdef012345',
  STATUS: 'done',
  NAME: 'Краторный био-бургер',
  CREATED_AT: '2024-01-15T12:00:00.000Z',
  UPDATED_AT: '2024-01-15T12:00:00.000Z',
  NUMBER: 12345,
  NUMBER_ALT: 12346,
} as const;

const INGREDIENT_IDS = {
  BUN: '643d69a5c3f7b9001cfa093c',
  MAIN: '643d69a5c3f7b9001cfa0941',
} as const;

const FEEDS_DATA = {
  TOTAL: 100,
  TOTAL_TODAY: 10,
} as const;

const ACTION_TYPES = {
  UNKNOWN: 'unknown',
} as const;

describe('orderSlice', () => {
  const mockOrder: TOrder = {
    _id: ORDER_DATA.ID,
    status: ORDER_DATA.STATUS,
    name: ORDER_DATA.NAME,
    createdAt: ORDER_DATA.CREATED_AT,
    updatedAt: ORDER_DATA.UPDATED_AT,
    number: ORDER_DATA.NUMBER,
    ingredients: [INGREDIENT_IDS.BUN, INGREDIENT_IDS.MAIN, INGREDIENT_IDS.BUN],
  };

  describe('Initial state', () => {
    it('должен возвращать начальное состояние', () => {
      expect(ordersReducer(undefined, { type: ACTION_TYPES.UNKNOWN })).toEqual(initialState);
    });

    it('должен иметь правильную структуру начального состояния', () => {
      expect(initialState).toEqual({
        orderData: null,
        orderNumber: null,
        loading: false,
        error: null,
        orders: [],
        total: 0,
        totalToday: 0,
        currentOrder: null,
      });
    });
  });

  describe('clearCurrentOrder', () => {
    it('должен очищать currentOrder', () => {
      const stateWithOrder = {
        ...initialState,
        currentOrder: mockOrder,
      };
      const result = ordersReducer(stateWithOrder, clearCurrentOrder());

      expect(result.currentOrder).toBeNull();
    });
  });

  describe('clearOrder', () => {
    it('должен очищать orderData, orderNumber, error и loading', () => {
      const stateWithData = {
        ...initialState,
        orderData: mockOrder,
        orderNumber: ORDER_DATA.NUMBER,
        loading: true,
        error: ERROR_MESSAGES.GENERIC,
      };
      const result = ordersReducer(stateWithData, clearOrder());

      expect(result.orderData).toBeNull();
      expect(result.orderNumber).toBeNull();
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('createOrder', () => {
    it('должен устанавливать loading в true при pending', () => {
      const action = { type: createOrder.pending.type };
      const result = ordersReducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должен сохранять заказ и номер заказа при fulfilled', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder,
      };
      const result = ordersReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.orderData).toEqual(mockOrder);
      expect(result.orderNumber).toBe(ORDER_DATA.NUMBER);
    });

    it('должен устанавливать ошибку при rejected', () => {
      const action = {
        type: createOrder.rejected.type,
        payload: ERROR_MESSAGES.CREATE_ORDER,
      };
      const result = ordersReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.CREATE_ORDER);
    });
  });

  describe('getFeeds', () => {
    it('должен сбрасывать ошибку при pending', () => {
      const stateWithError = {
        ...initialState,
        error: ERROR_MESSAGES.PREVIOUS,
      };
      const action = { type: getFeeds.pending.type };
      const result = ordersReducer(stateWithError, action);

      expect(result.error).toBeNull();
    });

    it('должен сохранять feeds данные при fulfilled', () => {
      const action = {
        type: getFeeds.fulfilled.type,
        payload: {
          orders: [mockOrder],
          total: FEEDS_DATA.TOTAL,
          totalToday: FEEDS_DATA.TOTAL_TODAY,
        },
      };
      const result = ordersReducer(initialState, action);

      expect(result.orders).toEqual([mockOrder]);
      expect(result.total).toBe(FEEDS_DATA.TOTAL);
      expect(result.totalToday).toBe(FEEDS_DATA.TOTAL_TODAY);
    });

    it('должен устанавливать ошибку при rejected', () => {
      const action = {
        type: getFeeds.rejected.type,
        payload: ERROR_MESSAGES.FEEDS,
      };
      const result = ordersReducer(initialState, action);

      expect(result.error).toBe(ERROR_MESSAGES.FEEDS);
    });
  });

  describe('getOrders', () => {
    it('должен сбрасывать ошибку при pending', () => {
      const stateWithError = {
        ...initialState,
        error: ERROR_MESSAGES.PREVIOUS,
      };
      const action = { type: getOrders.pending.type };
      const result = ordersReducer(stateWithError, action);

      expect(result.error).toBeNull();
    });

    it('должен сохранять пользовательские заказы при fulfilled', () => {
      const action = {
        type: getOrders.fulfilled.type,
        payload: [mockOrder, { ...mockOrder, number: ORDER_DATA.NUMBER_ALT }],
      };
      const result = ordersReducer(initialState, action);

      expect(result.orders).toHaveLength(2);
      expect(result.orders[0]).toEqual(mockOrder);
    });

    it('должен устанавливать ошибку при rejected', () => {
      const action = {
        type: getOrders.rejected.type,
        payload: ERROR_MESSAGES.ORDERS,
      };
      const result = ordersReducer(initialState, action);

      expect(result.error).toBe(ERROR_MESSAGES.ORDERS);
    });
  });

  describe('getOrderByNumber', () => {
    it('должен сбрасывать ошибку при pending', () => {
      const stateWithError = {
        ...initialState,
        error: ERROR_MESSAGES.PREVIOUS,
      };
      const action = { type: getOrderByNumber.pending.type };
      const result = ordersReducer(stateWithError, action);

      expect(result.error).toBeNull();
    });

    it('должен сохранять текущий заказ при fulfilled', () => {
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: { orders: [mockOrder] },
      };
      const result = ordersReducer(initialState, action);

      expect(result.currentOrder).toEqual(mockOrder);
    });

    it('должен устанавливать currentOrder в null если заказов нет', () => {
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: { orders: [] },
      };
      const result = ordersReducer(initialState, action);

      expect(result.currentOrder).toBeNull();
    });

    it('должен устанавливать ошибку при rejected', () => {
      const action = {
        type: getOrderByNumber.rejected.type,
        payload: ERROR_MESSAGES.NOT_FOUND,
      };
      const result = ordersReducer(initialState, action);

      expect(result.error).toBe(ERROR_MESSAGES.NOT_FOUND);
    });
  });

  describe('Полный цикл создания заказа', () => {
    it('должен корректно обрабатывать весь цикл: pending -> fulfilled', () => {
      let state = initialState;

      state = ordersReducer(state, { type: createOrder.pending.type });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.orderData).toBeNull();

      state = ordersReducer(state, {
        type: createOrder.fulfilled.type,
        payload: mockOrder,
      });
      expect(state.loading).toBe(false);
      expect(state.orderData).toEqual(mockOrder);
      expect(state.orderNumber).toBe(ORDER_DATA.NUMBER);
    });

    it('должен корректно обрабатывать цикл с ошибкой: pending -> rejected', () => {
      let state = initialState;

      state = ordersReducer(state, { type: createOrder.pending.type });
      expect(state.loading).toBe(true);

      state = ordersReducer(state, {
        type: createOrder.rejected.type,
        payload: ERROR_MESSAGES.NETWORK,
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe(ERROR_MESSAGES.NETWORK);
      expect(state.orderData).toBeNull();
    });
  });
});