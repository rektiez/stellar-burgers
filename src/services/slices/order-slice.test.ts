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

describe('orderSlice', () => {
  const mockOrder: TOrder = {
    _id: '6789abcdef012345',
    status: 'done',
    name: 'Краторный био-бургер',
    createdAt: '2024-01-15T12:00:00.000Z',
    updatedAt: '2024-01-15T12:00:00.000Z',
    number: 12345,
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941', '643d69a5c3f7b9001cfa093c']
  };

  describe('Initial state', () => {
    it('должен возвращать начальное состояние', () => {
      expect(ordersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
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
        currentOrder: null
      });
    });
  });

  describe('clearCurrentOrder', () => {
    it('должен очищать currentOrder', () => {
      const stateWithOrder = {
        ...initialState,
        currentOrder: mockOrder
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
        orderNumber: 12345,
        loading: true,
        error: 'Some error'
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
        payload: mockOrder
      };
      const result = ordersReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.orderData).toEqual(mockOrder);
      expect(result.orderNumber).toBe(12345);
    });

    it('должен устанавливать ошибку при rejected', () => {
      const action = {
        type: createOrder.rejected.type,
        payload: 'Ошибка заказа'
      };
      const result = ordersReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Ошибка заказа');
    });
  });

  describe('getFeeds', () => {
    it('должен сбрасывать ошибку при pending', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
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
          total: 100,
          totalToday: 10
        }
      };
      const result = ordersReducer(initialState, action);

      expect(result.orders).toEqual([mockOrder]);
      expect(result.total).toBe(100);
      expect(result.totalToday).toBe(10);
    });

    it('должен устанавливать ошибку при rejected', () => {
      const action = {
        type: getFeeds.rejected.type,
        payload: 'Ошибка загрузки лент'
      };
      const result = ordersReducer(initialState, action);

      expect(result.error).toBe('Ошибка загрузки лент');
    });
  });

  describe('getOrders', () => {
    it('должен сбрасывать ошибку при pending', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };
      const action = { type: getOrders.pending.type };
      const result = ordersReducer(stateWithError, action);

      expect(result.error).toBeNull();
    });

    it('должен сохранять пользовательские заказы при fulfilled', () => {
      const action = {
        type: getOrders.fulfilled.type,
        payload: [mockOrder, { ...mockOrder, number: 12346 }]
      };
      const result = ordersReducer(initialState, action);

      expect(result.orders).toHaveLength(2);
      expect(result.orders[0]).toEqual(mockOrder);
    });

    it('должен устанавливать ошибку при rejected', () => {
      const action = {
        type: getOrders.rejected.type,
        payload: 'Ошибка загрузки заказов'
      };
      const result = ordersReducer(initialState, action);

      expect(result.error).toBe('Ошибка загрузки заказов');
    });
  });

  describe('getOrderByNumber', () => {
    it('должен сбрасывать ошибку при pending', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };
      const action = { type: getOrderByNumber.pending.type };
      const result = ordersReducer(stateWithError, action);

      expect(result.error).toBeNull();
    });

    it('должен сохранять текущий заказ при fulfilled', () => {
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: { orders: [mockOrder] }
      };
      const result = ordersReducer(initialState, action);

      expect(result.currentOrder).toEqual(mockOrder);
    });

    it('должен устанавливать currentOrder в null если заказов нет', () => {
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: { orders: [] }
      };
      const result = ordersReducer(initialState, action);

      expect(result.currentOrder).toBeNull();
    });

    it('должен устанавливать ошибку при rejected', () => {
      const action = {
        type: getOrderByNumber.rejected.type,
        payload: 'Заказ не найден'
      };
      const result = ordersReducer(initialState, action);

      expect(result.error).toBe('Заказ не найден');
    });
  });

  describe('Полный цикл создания заказа', () => {
    it('должен корректно обрабатывать весь цикл: pending -> fulfilled', () => {
      let state = initialState;

      // Начало запроса
      state = ordersReducer(state, { type: createOrder.pending.type });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.orderData).toBeNull();

      // Успешный ответ
      state = ordersReducer(state, {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      });
      expect(state.loading).toBe(false);
      expect(state.orderData).toEqual(mockOrder);
      expect(state.orderNumber).toBe(12345);
    });

    it('должен корректно обрабатывать цикл с ошибкой: pending -> rejected', () => {
      let state = initialState;

      // Начало запроса
      state = ordersReducer(state, { type: createOrder.pending.type });
      expect(state.loading).toBe(true);

      // Ошибка
      state = ordersReducer(state, {
        type: createOrder.rejected.type,
        payload: 'Network error'
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.orderData).toBeNull();
    });
  });
});