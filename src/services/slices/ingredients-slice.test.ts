import '@testing-library/jest-dom';
import ingredientsReducer, { fetchIngredients, initialState } from './ingredients-slice';
import { TIngredient } from '../../utils/types';

const ERROR_MESSAGES = {
  PREVIOUS: 'Предыдущая ошибка',
  LOAD_INGREDIENTS: 'Ошибка загрузки ингредиентов',
  OLD: 'Старая ошибка',
  NEW: 'Новая ошибка',
  DEFAULT: 'Failed to load ingredients',
  NETWORK: 'Network error',
} as const;

const ACTION_TYPES = {
  UNKNOWN: 'unknown',
} as const;

const INGREDIENT_IDS = {
  BUN: '643d69a5c3f7b9001cfa093c',
  MAIN: '643d69a5c3f7b9001cfa0941',
  SAUCE: '643d69a5c3f7b9001cfa0942',
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

const NUTRITION = {
  BUN: { proteins: 80, fat: 24, carbohydrates: 53, calories: 420, price: 1255 },
  MAIN: { proteins: 420, fat: 142, carbohydrates: 242, calories: 4242, price: 424 },
  SAUCE: { proteins: 30, fat: 20, carbohydrates: 40, calories: 30, price: 90 },
} as const;

const INGREDIENT_NAMES = {
  BUN: 'Краторная булка N-200i',
  MAIN: 'Биокотлета из марсианской Магнолии',
  SAUCE: 'Соус Spicy-X',
} as const;

describe('ingredientsSlice', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: INGREDIENT_IDS.BUN,
      name: INGREDIENT_NAMES.BUN,
      type: 'bun',
      ...NUTRITION.BUN,
      image: IMAGES.BUN,
      image_mobile: IMAGES.BUN_MOBILE,
      image_large: IMAGES.BUN_LARGE,
    },
    {
      _id: INGREDIENT_IDS.MAIN,
      name: INGREDIENT_NAMES.MAIN,
      type: 'main',
      ...NUTRITION.MAIN,
      image: IMAGES.MAIN,
      image_mobile: IMAGES.MAIN_MOBILE,
      image_large: IMAGES.MAIN_LARGE,
    },
    {
      _id: INGREDIENT_IDS.SAUCE,
      name: INGREDIENT_NAMES.SAUCE,
      type: 'sauce',
      ...NUTRITION.SAUCE,
      image: IMAGES.SAUCE,
      image_mobile: IMAGES.SAUCE_MOBILE,
      image_large: IMAGES.SAUCE_LARGE,
    },
  ];

  describe('Initial state', () => {
    it('должен возвращать начальное состояние', () => {
      expect(ingredientsReducer(undefined, { type: ACTION_TYPES.UNKNOWN })).toEqual(initialState);
    });

    it('должен иметь правильную структуру начального состояния', () => {
      expect(initialState).toEqual({
        ingredients: [],
        isIngredientsLoading: false,
        error: null,
      });
    });
  });

  describe('fetchIngredients.pending', () => {
    it('должен устанавливать isIngredientsLoading в true', () => {
      const action = { type: fetchIngredients.pending.type };
      const result = ingredientsReducer(initialState, action);

      expect(result.isIngredientsLoading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должен сбрасывать ошибку при новом запросе', () => {
      const stateWithError = {
        ...initialState,
        isIngredientsLoading: false,
        error: ERROR_MESSAGES.PREVIOUS,
      };

      const action = { type: fetchIngredients.pending.type };
      const result = ingredientsReducer(stateWithError, action);

      expect(result.isIngredientsLoading).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('fetchIngredients.fulfilled', () => {
    it('должен сохранять данные и устанавливать isIngredientsLoading в false', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients,
      };
      const result = ingredientsReducer(initialState, action);

      expect(result.isIngredientsLoading).toBe(false);
      expect(result.ingredients).toEqual(mockIngredients);
      expect(result.error).toBeNull();
    });

    it('должен заменять существующие данные', () => {
      const oldState = {
        ...initialState,
        ingredients: [mockIngredients[0]],
        isIngredientsLoading: false,
        error: null,
      };

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients,
      };
      const result = ingredientsReducer(oldState, action);

      expect(result.ingredients).toEqual(mockIngredients);
      expect(result.ingredients).not.toEqual(oldState.ingredients);
    });
  });

  describe('fetchIngredients.rejected', () => {
    it('должен сохранять ошибку и устанавливать isIngredientsLoading в false', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        payload: ERROR_MESSAGES.LOAD_INGREDIENTS,
      };
      const result = ingredientsReducer(initialState, action);

      expect(result.isIngredientsLoading).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.LOAD_INGREDIENTS);
    });

    it('должен заменять предыдущую ошибку', () => {
      const stateWithOldError = {
        ...initialState,
        isIngredientsLoading: false,
        error: ERROR_MESSAGES.OLD,
      };

      const action = {
        type: fetchIngredients.rejected.type,
        payload: ERROR_MESSAGES.NEW,
      };
      const result = ingredientsReducer(stateWithOldError, action);

      expect(result.isIngredientsLoading).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.NEW);
    });

    it('должен использовать значение по умолчанию если payload не строка', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        payload: null,
      };
      const result = ingredientsReducer(initialState, action);

      expect(result.isIngredientsLoading).toBe(false);
      expect(result.error).toBe(ERROR_MESSAGES.DEFAULT);
    });
  });

  describe('Полный цикл запроса', () => {
    it('должен корректно обрабатывать весь цикл: pending -> fulfilled', () => {
      let state = initialState;

      state = ingredientsReducer(state, { type: fetchIngredients.pending.type });
      expect(state.isIngredientsLoading).toBe(true);
      expect(state.ingredients).toEqual([]);
      expect(state.error).toBeNull();

      state = ingredientsReducer(state, {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients,
      });
      expect(state.isIngredientsLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual(mockIngredients);
    });

    it('должен корректно обрабатывать цикл с ошибкой: pending -> rejected', () => {
      let state = initialState;

      state = ingredientsReducer(state, { type: fetchIngredients.pending.type });
      expect(state.isIngredientsLoading).toBe(true);

      state = ingredientsReducer(state, {
        type: fetchIngredients.rejected.type,
        payload: ERROR_MESSAGES.NETWORK,
      });
      expect(state.isIngredientsLoading).toBe(false);
      expect(state.error).toBe(ERROR_MESSAGES.NETWORK);
      expect(state.ingredients).toEqual([]);
    });
  });
});