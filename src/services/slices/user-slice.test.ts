import '@testing-library/jest-dom';
import userReducer, {
  registerUser,
  loginUser,
  logoutUser,
  fetchUser,
  updateUser,
  clearUser,
  setAuthChecked,
  clearError,
  initialState
} from './user-slice';
import { TUser } from '../../utils/types';

describe('userSlice', () => {
  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  describe('Initial state', () => {
    it('должен возвращать начальное состояние', () => {
      expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('должен иметь правильную структуру начального состояния', () => {
      expect(initialState).toEqual({
        user: null,
        loading: false,
        error: null,
        isAuthChecked: false,
        isAuthenticated: false
      });
    });
  });

  describe('clearUser', () => {
    it('должен очищать пользователя и устанавливать флаги', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true,
        isAuthChecked: false
      };
      const result = userReducer(stateWithUser, clearUser());

      expect(result.user).toBeNull();
      expect(result.isAuthenticated).toBe(false);
      expect(result.isAuthChecked).toBe(true);
    });
  });

  describe('setAuthChecked', () => {
    it('должен устанавливать isAuthChecked', () => {
      const result = userReducer(initialState, setAuthChecked(true));

      expect(result.isAuthChecked).toBe(true);
    });
  });

  describe('clearError', () => {
    it('должен очищать ошибку', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error'
      };
      const result = userReducer(stateWithError, clearError());

      expect(result.error).toBeNull();
    });
  });

  describe('registerUser', () => {
    it('должен сбрасывать ошибку при pending', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };
      const action = { type: registerUser.pending.type };
      const result = userReducer(stateWithError, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должен сохранять пользователя при fulfilled', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: {
          user: mockUser,
          accessToken: 'mock-token',
          refreshToken: 'mock-refresh'
        }
      };
      const result = userReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.user).toEqual(mockUser);
      expect(result.isAuthenticated).toBe(true);
      expect(result.isAuthChecked).toBe(true);
    });

    it('должен устанавливать ошибку при rejected', () => {
      const action = {
        type: registerUser.rejected.type,
        payload: 'Пользователь с таким email уже существует'
      };
      const result = userReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Пользователь с таким email уже существует');
      expect(result.isAuthChecked).toBe(true);
    });
  });

  describe('loginUser', () => {
    it('должен сбрасывать ошибку при pending', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };
      const action = { type: loginUser.pending.type };
      const result = userReducer(stateWithError, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должен сохранять пользователя при fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: {
          user: mockUser,
          accessToken: 'mock-token',
          refreshToken: 'mock-refresh'
        }
      };
      const result = userReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.user).toEqual(mockUser);
      expect(result.isAuthenticated).toBe(true);
      expect(result.isAuthChecked).toBe(true);
    });

    it('должен устанавливать ошибку при rejected', () => {
      const action = {
        type: loginUser.rejected.type,
        payload: 'Неверный email или пароль'
      };
      const result = userReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Неверный email или пароль');
      expect(result.isAuthChecked).toBe(true);
    });
  });

  describe('fetchUser', () => {
    it('должен сбрасывать ошибку при pending', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка'
      };
      const action = { type: fetchUser.pending.type };
      const result = userReducer(stateWithError, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });

    it('должен сохранять пользователя при fulfilled', () => {
      const action = {
        type: fetchUser.fulfilled.type,
        payload: mockUser
      };
      const result = userReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.user).toEqual(mockUser);
      expect(result.isAuthenticated).toBe(true);
      expect(result.isAuthChecked).toBe(true);
    });

    it('должен очищать пользователя при rejected', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true
      };
      const action = {
        type: fetchUser.rejected.type,
        payload: ''
      };
      const result = userReducer(stateWithUser, action);

      expect(result.loading).toBe(false);
      expect(result.user).toBeNull();
      expect(result.isAuthenticated).toBe(false);
      expect(result.isAuthChecked).toBe(true);
    });
  });

  describe('updateUser', () => {
    it('должен обновлять данные пользователя при fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser
      };
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      };
      const result = userReducer(stateWithUser, action);

      expect(result.user).toEqual(updatedUser);
    });

  });

  describe('logoutUser', () => {
    it('должен очищать пользователя при fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true,
        loading: true
      };
      const action = { type: logoutUser.fulfilled.type };
      const result = userReducer(stateWithUser, action);

      expect(result.user).toBeNull();
      expect(result.isAuthenticated).toBe(false);
      expect(result.isAuthChecked).toBe(true);
      expect(result.loading).toBe(false);
    });

    it('должен устанавливать ошибку при rejected', () => {
      const action = {
        type: logoutUser.rejected.type,
        payload: 'Не удалось выйти'
      };
      const result = userReducer(initialState, action);

      expect(result.error).toBe('Не удалось выйти');
      expect(result.isAuthChecked).toBe(true);
    });
  });

  describe('Полный цикл авторизации', () => {
    it('должен корректно обрабатывать цикл: pending -> fulfilled (login)', () => {
      let state = initialState;

      // Начало запроса
      state = userReducer(state, { type: loginUser.pending.type });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();

      // Успешный ответ
      state = userReducer(state, {
        type: loginUser.fulfilled.type,
        payload: {
          user: mockUser,
          accessToken: 'mock-token',
          refreshToken: 'mock-refresh'
        }
      });
      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    it('должен корректно обрабатывать цикл с ошибкой: pending -> rejected', () => {
      let state = initialState;

      // Начало запроса
      state = userReducer(state, { type: loginUser.pending.type });
      expect(state.loading).toBe(true);

      // Ошибка
      state = userReducer(state, {
        type: loginUser.rejected.type,
        payload: 'Неверный email или пароль'
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Неверный email или пароль');
      expect(state.isAuthChecked).toBe(true);
    });
  });
});