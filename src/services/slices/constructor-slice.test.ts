import '@testing-library/jest-dom';
import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  clearOrderModal,
  makeOrder,
  initialState
} from './constructor-slice';
import { TConstructorIngredient, TIngredient } from '../../utils/types';

jest.mock('@reduxjs/toolkit', () => ({
  ...jest.requireActual('@reduxjs/toolkit'),
  nanoid: () => 'test-uuid-123'
}));

const NAMES = {
  BUN: 'Краторная булка N-200i',
  MAIN: 'Биокотлета из марсианской Магнолии',
  SAUCE: 'Соус Spicy-X',
  FIRST: 'Первый',
  SECOND: 'Второй',
  THIRD: 'Третий',
  NEW_BUN: 'Новая булка',
  TEST_ORDER: 'Test Order',
} as const;

const IMAGES = {
  BUN: 'https://code.s3.yandex.net/react/code/bun-02.png',
  BUN_MOBILE: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  BUN_LARGE: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  MAIN: 'https://code.s3.yandex.net/react/code/meat-01.png',
  MAIN_MOBILE: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  MAIN_LARGE: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  SAUCE: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  SAUCE_MOBILE: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  SAUCE_LARGE: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
} as const;

const ERRORS = {
  CREATE_ORDER: 'Failed to create order',
  GENERIC: 'Some error',
} as const;

const ORDER_DATA = {
  NUMBER: 12345,
  STATUS: 'done',
  CREATED_AT: '2024-01-01T00:00:00.000Z',
  UPDATED_AT: '2024-01-01T00:00:00.000Z',
} as const;

const NUTRITION = {
  BUN: { proteins: 80, fat: 24, carbohydrates: 53, calories: 420, price: 1255 },
  MAIN: { proteins: 420, fat: 142, carbohydrates: 242, calories: 4242, price: 424 },
  SAUCE: { proteins: 30, fat: 20, carbohydrates: 40, calories: 30, price: 90 },
} as const;

const UUID = {
  TEST: 'test-uuid-123',
} as const;

describe('constructorSlice', () => {
  const mockBun: TIngredient = {
    _id: '1',
    name: NAMES.BUN,
    type: 'bun',
    ...NUTRITION.BUN,
    image: IMAGES.BUN,
    image_mobile: IMAGES.BUN_MOBILE,
    image_large: IMAGES.BUN_LARGE,
  };

  const mockIngredient: TIngredient = {
    _id: '2',
    name: NAMES.MAIN,
    type: 'main',
    ...NUTRITION.MAIN,
    image: IMAGES.MAIN,
    image_mobile: IMAGES.MAIN_MOBILE,
    image_large: IMAGES.MAIN_LARGE,
  };

  const mockSauce: TIngredient = {
    _id: '3',
    name: NAMES.SAUCE,
    type: 'sauce',
    ...NUTRITION.SAUCE,
    image: IMAGES.SAUCE,
    image_mobile: IMAGES.SAUCE_MOBILE,
    image_large: IMAGES.SAUCE_LARGE,
  };

  describe('Initial state', () => {
    it('должен возвращать начальное состояние', () => {
      expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('должен иметь правильную структуру начального состояния', () => {
      expect(initialState).toEqual({
        bun: null,
        ingredients: [],
        orderRequest: false,
        orderModalData: null,
        error: null,
      });
    });
  });

  describe('addIngredient', () => {
    it('должен добавлять булку в state.bun', () => {
      const result = constructorReducer(initialState, addIngredient(mockBun));

      expect(result.bun).toEqual({
        ...mockBun,
        id: UUID.TEST,
      });
      expect(result.ingredients).toHaveLength(0);
    });

    it('должен добавлять основной ингредиент в массив ingredients', () => {
      const result = constructorReducer(initialState, addIngredient(mockIngredient));

      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0]).toEqual({
        ...mockIngredient,
        id: UUID.TEST,
      });
    });

    it('должен добавлять соус в массив ingredients', () => {
      const result = constructorReducer(initialState, addIngredient(mockSauce));

      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0]).toEqual({
        ...mockSauce,
        id: UUID.TEST,
      });
    });

    it('должен заменять существующую булку', () => {
      const stateWithBun = {
        ...initialState,
        bun: { ...mockBun, id: 'old-id' },
      };

      const newBun = { ...mockBun, name: NAMES.NEW_BUN };
      const result = constructorReducer(stateWithBun, addIngredient(newBun));

      expect(result.bun).toEqual({
        ...newBun,
        id: UUID.TEST,
      });
    });
  });

  describe('removeIngredient', () => {
    it('должен удалять ингредиент по id', () => {
      const stateWithIngredient = {
        ...initialState,
        ingredients: [
          { ...mockIngredient, id: 'test-id-to-delete' } as TConstructorIngredient,
        ],
      };

      const result = constructorReducer(stateWithIngredient, removeIngredient('test-id-to-delete'));

      expect(result.ingredients).toHaveLength(0);
    });

    it('должен удалять только указанный ингредиент', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...mockIngredient, id: 'id-1' } as TConstructorIngredient,
          { ...mockSauce, id: 'id-2' } as TConstructorIngredient,
          { ...mockIngredient, id: 'id-3' } as TConstructorIngredient,
        ],
      };

      const result = constructorReducer(stateWithIngredients, removeIngredient('id-2'));

      expect(result.ingredients).toHaveLength(2);
      expect(result.ingredients[0].id).toBe('id-1');
      expect(result.ingredients[1].id).toBe('id-3');
    });

    it('не должен изменять состояние, если id не найден', () => {
      const stateWithIngredient = {
        ...initialState,
        ingredients: [
          { ...mockIngredient, id: 'existing-id' } as TConstructorIngredient,
        ],
      };

      const result = constructorReducer(stateWithIngredient, removeIngredient('non-existent-id'));

      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0].id).toBe('existing-id');
    });
  });

  describe('moveIngredient', () => {
    it('должен перемещать ингредиент вверх (с позиции 2 на позицию 0)', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...mockIngredient, id: 'id-1', name: NAMES.FIRST } as TConstructorIngredient,
          { ...mockSauce, id: 'id-2', name: NAMES.SECOND } as TConstructorIngredient,
          { ...mockIngredient, id: 'id-3', name: NAMES.THIRD } as TConstructorIngredient,
        ],
      };

      const result = constructorReducer(
        stateWithIngredients,
        moveIngredient({ fromIndex: 2, toIndex: 0 })
      );

      expect(result.ingredients[0].name).toBe(NAMES.THIRD);
      expect(result.ingredients[1].name).toBe(NAMES.FIRST);
      expect(result.ingredients[2].name).toBe(NAMES.SECOND);
    });

    it('должен перемещать ингредиент вниз (с позиции 0 на позицию 2)', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...mockIngredient, id: 'id-1', name: NAMES.FIRST } as TConstructorIngredient,
          { ...mockSauce, id: 'id-2', name: NAMES.SECOND } as TConstructorIngredient,
          { ...mockIngredient, id: 'id-3', name: NAMES.THIRD } as TConstructorIngredient,
        ],
      };

      const result = constructorReducer(
        stateWithIngredients,
        moveIngredient({ fromIndex: 0, toIndex: 2 })
      );

      expect(result.ingredients[0].name).toBe(NAMES.SECOND);
      expect(result.ingredients[1].name).toBe(NAMES.THIRD);
      expect(result.ingredients[2].name).toBe(NAMES.FIRST);
    });

    it('не должен изменять массив при перемещении на ту же позицию', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [
          { ...mockIngredient, id: 'id-1' } as TConstructorIngredient,
          { ...mockSauce, id: 'id-2' } as TConstructorIngredient,
        ],
      };

      const result = constructorReducer(
        stateWithIngredients,
        moveIngredient({ fromIndex: 0, toIndex: 0 })
      );

      expect(result.ingredients).toEqual(stateWithIngredients.ingredients);
    });
  });

  describe('clearConstructor', () => {
    it('должен очищать булку и ингредиенты', () => {
      const stateWithData = {
        bun: { ...mockBun, id: 'bun-id' } as TConstructorIngredient,
        ingredients: [
          { ...mockIngredient, id: 'ing-id' } as TConstructorIngredient,
        ],
        orderRequest: false,
        orderModalData: null,
        error: null,
      };

      const result = constructorReducer(stateWithData, clearConstructor());

      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(0);
    });

    it('не должен затрагивать orderModalData и error', () => {
      const stateWithData = {
        bun: { ...mockBun, id: 'bun-id' } as TConstructorIngredient,
        ingredients: [
          { ...mockIngredient, id: 'ing-id' } as TConstructorIngredient,
        ],
        orderRequest: false,
        orderModalData: { number: ORDER_DATA.NUMBER } as any,
        error: ERRORS.GENERIC,
      };

      const result = constructorReducer(stateWithData, clearConstructor());

      expect(result.orderModalData).toEqual({ number: ORDER_DATA.NUMBER });
      expect(result.error).toBe(ERRORS.GENERIC);
    });
  });

  describe('clearOrderModal', () => {
    it('должен очищать orderModalData', () => {
      const stateWithOrder = {
        ...initialState,
        orderModalData: { number: ORDER_DATA.NUMBER } as any,
      };

      const result = constructorReducer(stateWithOrder, clearOrderModal());

      expect(result.orderModalData).toBeNull();
    });
  });

  describe('makeOrder (async thunk)', () => {
    it('должен устанавливать orderRequest в true при pending', () => {
      const result = constructorReducer(initialState, makeOrder.pending('request-id', ['ing-1', 'ing-2']));

      expect(result.orderRequest).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должен сохранять заказ и очищать конструктор при fulfilled', () => {
      const mockOrder = {
        _id: 'order-id',
        number: ORDER_DATA.NUMBER,
        name: NAMES.TEST_ORDER,
        status: ORDER_DATA.STATUS,
        createdAt: ORDER_DATA.CREATED_AT,
        updatedAt: ORDER_DATA.UPDATED_AT,
        ingredients: ['ing-1', 'ing-2'],
      };

      const stateWithIngredients = {
        bun: { ...mockBun, id: 'bun-id' } as TConstructorIngredient,
        ingredients: [
          { ...mockIngredient, id: 'ing-1' } as TConstructorIngredient,
        ],
        orderRequest: true,
        orderModalData: null,
        error: null,
      };

      const result = constructorReducer(stateWithIngredients, makeOrder.fulfilled(mockOrder, 'request-id', ['ing-1', 'ing-2']));

      expect(result.orderRequest).toBe(false);
      expect(result.orderModalData).toEqual(mockOrder);
      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(0);
    });

    it('должен устанавливать ошибку при rejected', () => {
      const action = {
        type: makeOrder.rejected.type,
        payload: ERRORS.CREATE_ORDER,
      };
      const result = constructorReducer(initialState, action);

      expect(result.orderRequest).toBe(false);
      expect(result.error).toBe(ERRORS.CREATE_ORDER);
    });
  });
});