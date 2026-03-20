import '@testing-library/jest-dom';
import ingredientsReducer, { fetchIngredients, initialState } from './ingredients-slice';
import { TIngredient } from '../../utils/types';

describe('ingredientsSlice', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0942',
      name: 'Соус Spicy-X',
      type: 'sauce',
      proteins: 30,
      fat: 20,
      carbohydrates: 40,
      calories: 30,
      price: 90,
      image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
    }
  ];

  describe('Initial state', () => {
    it('должен возвращать начальное состояние', () => {
      expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('должен иметь правильную структуру начального состояния', () => {
      expect(initialState).toEqual({
        ingredients: [],
        isIngredientsLoading: false,
        error: null
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
        error: 'Предыдущая ошибка'
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
        payload: mockIngredients
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
        error: null
      };

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
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
        payload: 'Ошибка загрузки ингредиентов'
      };
      const result = ingredientsReducer(initialState, action);

      expect(result.isIngredientsLoading).toBe(false);
      expect(result.error).toBe('Ошибка загрузки ингредиентов');
    });

    it('должен заменять предыдущую ошибку', () => {
      const stateWithOldError = {
        ...initialState,
        isIngredientsLoading: false,
        error: 'Старая ошибка'
      };

      const action = {
        type: fetchIngredients.rejected.type,
        payload: 'Новая ошибка'
      };
      const result = ingredientsReducer(stateWithOldError, action);

      expect(result.isIngredientsLoading).toBe(false);
      expect(result.error).toBe('Новая ошибка');
    });

    it('должен использовать значение по умолчанию если payload не строка', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        payload: null
      };
      const result = ingredientsReducer(initialState, action);

      expect(result.isIngredientsLoading).toBe(false);
      expect(result.error).toBe('Failed to load ingredients');
    });
  });

  describe('Полный цикл запроса', () => {
    it('должен корректно обрабатывать весь цикл: pending -> fulfilled', () => {
      let state = initialState;

      // Начало запроса
      state = ingredientsReducer(state, { type: fetchIngredients.pending.type });
      expect(state.isIngredientsLoading).toBe(true);
      expect(state.ingredients).toEqual([]);
      expect(state.error).toBeNull();

      // Успешный ответ
      state = ingredientsReducer(state, {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      });
      expect(state.isIngredientsLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual(mockIngredients);
    });

    it('должен корректно обрабатывать цикл с ошибкой: pending -> rejected', () => {
      let state = initialState;

      // Начало запроса
      state = ingredientsReducer(state, { type: fetchIngredients.pending.type });
      expect(state.isIngredientsLoading).toBe(true);

      // Ошибка
      state = ingredientsReducer(state, {
        type: fetchIngredients.rejected.type,
        payload: 'Network error'
      });
      expect(state.isIngredientsLoading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.ingredients).toEqual([]);
    });
  });
});