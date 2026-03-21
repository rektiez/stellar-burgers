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

const ERROR_MESSAGES = {
  PREVIOUS: 'Предыдущая ошибка',
  GENERIC: 'Some error',
  EMAIL_EXISTS: 'Пользователь с таким email уже существует',
  WRONG_CREDENTIALS: 'Неверный email или пароль',
  LOGOUT_FAILED: 'Не удалось выйти',
  EMPTY: '',
} as const;

const USER_DATA = {
  EMAIL: 'test@example.com',
  NAME: 'Test User',
  NAME_UPDATED: 'Updated Name',
} as const;

const TOKENS = {
  ACCESS: 'mock-token',
  REFRESH: 'mock-refresh',
} as const;

const ACTION_TYPES = {
  UNKNOWN: 'unknown',
} as const;

const AUTH_FLAGS = {
  TRUE: true,
  FALSE: false,
} as const;

describe('userSlice', () => {
  const mockUser: TUser = {
    email: USER_DATA.EMAIL,
    name: USER_DATA.NAME,
  };

  describe('Initial state', () => {
    it('должен возвращать начальное состояние', () => {
      expect(userReducer(undefined, { type: ACTION_TYPES.UNKNOWN })).toEqual(initialState);
    });

    it('должен иметь правильную структуру начального состояния', () => {
      expect(initialState).toEqual({
        user: null,
        loading: AUTH_FLAGS.FALSE,
        error: null,
        isAuthChecked: AUTH_FLAGS.FALSE,
        isAuthenticated: AUTH_FLAGS.FALSE,
      });
    });
  });

  describe('clearUser', () => {
    it('должен очищать пользователя и устанавливать флаги', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthenticated: AUTH_FLAGS.TRUE,
        isAuthChecked: AUTH_FLAGS.FALSE,
      };
      const result = userReducer(stateWithUser, clearUser());

      expect(result.user).toBeNull();
      expect(result.isAuthenticated).toBe(AUTH_FLAGS.FALSE);
      expect(result.isAuthChecked).toBe(AUTH_FLAGS.TRUE);
    });
  });

  describe('setAuthChecked', () => {
    it('должен устанавливать isAuthChecked', () => {
      const result = userReducer(initialState, setAuthChecked(AUTH_FLAGS.TRUE));

      expect(result.isAuthChecked).toBe(AUTH_FLAGS.TRUE);
    });
  });

  describe('clearError', () => {
    it('должен очищать ошибку', () => {
      const stateWithError = {
        ...initialState,
        error: ERROR_MESSAGES.GENERIC,
      };
      const result = userReducer(stateWithError, clearError());

      expect(result.error).toBeNull();
    });
  });

  describe('registerUser', () => {
    it('должен сбрасывать ошибку при pending', () => {
      const stateWithError = {
        ...initialState,
        error: ERROR_MESSAGES.PREVIOUS,
      };
      const action = { type: registerUser.pending.type };
      const result = userReducer(stateWithError, action);

      expect(result.loading).toBe(AUTH_FLAGS.TRUE);
      expect(result.error).toBeNull();
    });

    it('должен сохранять пользователя при fulfilled', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: {
          user: mockUser,
          accessToken: TOKENS.ACCESS,
          refreshToken: TOKENS.REFRESH,
        },
      };
      const result = userReducer(initialState, action);

      expect(result.loading).toBe(AUTH_FLAGS.FALSE);
      expect(result.user).toEqual(mockUser);
      expect(result.isAuthenticated).toBe(AUTH_FLAGS.TRUE);
      expect(result.isAuthChecked).toBe(AUTH_FLAGS.TRUE);
    });

    it('должен устанавливать ошибку при rejected', () => {
      const action = {
        type: registerUser.rejected.type,
        payload: ERROR_MESSAGES.EMAIL_EXISTS,
      };
      const result = userReducer(initialState, action);

      expect(result.loading).toBe(AUTH_FLAGS.FALSE);
      expect(result.error).toBe(ERROR_MESSAGES.EMAIL_EXISTS);
      expect(result.isAuthChecked).toBe(AUTH_FLAGS.TRUE);
    });
  });

  describe('loginUser', () => {
    it('должен сбрасывать ошибку при pending', () => {
      const stateWithError = {
        ...initialState,
        error: ERROR_MESSAGES.PREVIOUS,
      };
      const action = { type: loginUser.pending.type };
      const result = userReducer(stateWithError, action);

      expect(result.loading).toBe(AUTH_FLAGS.TRUE);
      expect(result.error).toBeNull();
    });

    it('должен сохранять пользователя при fulfilled', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: {
          user: mockUser,
          accessToken: TOKENS.ACCESS,
          refreshToken: TOKENS.REFRESH,
        },
      };
      const result = userReducer(initialState, action);

      expect(result.loading).toBe(AUTH_FLAGS.FALSE);
      expect(result.user).toEqual(mockUser);
      expect(result.isAuthenticated).toBe(AUTH_FLAGS.TRUE);
      expect(result.isAuthChecked).toBe(AUTH_FLAGS.TRUE);
    });

    it('должен устанавливать ошибку при rejected', () => {
      const action = {
        type: loginUser.rejected.type,
        payload: ERROR_MESSAGES.WRONG_CREDENTIALS,
      };
      const result = userReducer(initialState, action);

      expect(result.loading).toBe(AUTH_FLAGS.FALSE);
      expect(result.error).toBe(ERROR_MESSAGES.WRONG_CREDENTIALS);
      expect(result.isAuthChecked).toBe(AUTH_FLAGS.TRUE);
    });
  });

  describe('fetchUser', () => {
    it('должен сбрасывать ошибку при pending', () => {
      const stateWithError = {
        ...initialState,
        error: ERROR_MESSAGES.PREVIOUS,
      };
      const action = { type: fetchUser.pending.type };
      const result = userReducer(stateWithError, action);

      expect(result.loading).toBe(AUTH_FLAGS.TRUE);
      expect(result.error).toBeNull();
    });

    it('должен сохранять пользователя при fulfilled', () => {
      const action = {
        type: fetchUser.fulfilled.type,
        payload: mockUser,
      };
      const result = userReducer(initialState, action);

      expect(result.loading).toBe(AUTH_FLAGS.FALSE);
      expect(result.user).toEqual(mockUser);
      expect(result.isAuthenticated).toBe(AUTH_FLAGS.TRUE);
      expect(result.isAuthChecked).toBe(AUTH_FLAGS.TRUE);
    });

    it('должен очищать пользователя при rejected', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthenticated: AUTH_FLAGS.TRUE,
      };
      const action = {
        type: fetchUser.rejected.type,
        payload: ERROR_MESSAGES.EMPTY,
      };
      const result = userReducer(stateWithUser, action);

      expect(result.loading).toBe(AUTH_FLAGS.FALSE);
      expect(result.user).toBeNull();
      expect(result.isAuthenticated).toBe(AUTH_FLAGS.FALSE);
      expect(result.isAuthChecked).toBe(AUTH_FLAGS.TRUE);
    });
  });

  describe('updateUser', () => {
    it('должен обновлять данные пользователя при fulfilled', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
      };
      const updatedUser = { ...mockUser, name: USER_DATA.NAME_UPDATED };
      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser,
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
        isAuthenticated: AUTH_FLAGS.TRUE,
        loading: AUTH_FLAGS.TRUE,
      };
      const action = { type: logoutUser.fulfilled.type };
      const result = userReducer(stateWithUser, action);

      expect(result.user).toBeNull();
      expect(result.isAuthenticated).toBe(AUTH_FLAGS.FALSE);
      expect(result.isAuthChecked).toBe(AUTH_FLAGS.TRUE);
      expect(result.loading).toBe(AUTH_FLAGS.FALSE);
    });

    it('должен устанавливать ошибку при rejected', () => {
      const action = {
        type: logoutUser.rejected.type,
        payload: ERROR_MESSAGES.LOGOUT_FAILED,
      };
      const result = userReducer(initialState, action);

      expect(result.error).toBe(ERROR_MESSAGES.LOGOUT_FAILED);
      expect(result.isAuthChecked).toBe(AUTH_FLAGS.TRUE);
    });
  });

  describe('Полный цикл авторизации', () => {
    it('должен корректно обрабатывать цикл: pending -> fulfilled (login)', () => {
      let state = initialState;

      state = userReducer(state, { type: loginUser.pending.type });
      expect(state.loading).toBe(AUTH_FLAGS.TRUE);
      expect(state.error).toBeNull();

      state = userReducer(state, {
        type: loginUser.fulfilled.type,
        payload: {
          user: mockUser,
          accessToken: TOKENS.ACCESS,
          refreshToken: TOKENS.REFRESH,
        },
      });
      expect(state.loading).toBe(AUTH_FLAGS.FALSE);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(AUTH_FLAGS.TRUE);
      expect(state.isAuthChecked).toBe(AUTH_FLAGS.TRUE);
    });

    it('должен корректно обрабатывать цикл с ошибкой: pending -> rejected', () => {
      let state = initialState;

      state = userReducer(state, { type: loginUser.pending.type });
      expect(state.loading).toBe(AUTH_FLAGS.TRUE);

      state = userReducer(state, {
        type: loginUser.rejected.type,
        payload: ERROR_MESSAGES.WRONG_CREDENTIALS,
      });
      expect(state.loading).toBe(AUTH_FLAGS.FALSE);
      expect(state.error).toBe(ERROR_MESSAGES.WRONG_CREDENTIALS);
      expect(state.isAuthChecked).toBe(AUTH_FLAGS.TRUE);
    });
  });
});