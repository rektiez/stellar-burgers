import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteCookie, setCookie } from '../../utils/cookie';
import { TUser } from '../../utils/types';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '../../utils/burger-api';

type TUserState = {
  user: TUser | null;
  loading: boolean;
  error: string | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
};

export const initialState: TUserState = {
  user: null,
  loading: false,
  error: null,
  isAuthChecked: false,
  isAuthenticated: false
};

export const registerUser = createAsyncThunk<
  { user: TUser; accessToken: string; refreshToken: string },
  TRegisterData,
  { rejectValue: string }
>('user/register', async (registerData, { rejectWithValue }) => {
  try {
    const data = await registerUserApi(registerData);
    if (!data.success) {
      return rejectWithValue('Ошибка регистрации');
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      const message = error.message || '';
      if (message.includes('400')) {
        return rejectWithValue('Пользователь с таким email уже существует');
      }
      if (
        message.includes('401') ||
        message.toLowerCase().includes('unauthorized')
      ) {
        return rejectWithValue('Неверные данные');
      }
      if (message.includes('Network') || message.includes('Failed to fetch')) {
        return rejectWithValue('Ошибка подключения к серверу');
      }
      return rejectWithValue(message);
    }
    return rejectWithValue('Ошибка подключения к серверу');
  }
});

export const loginUser = createAsyncThunk<
  { user: TUser; accessToken: string; refreshToken: string },
  TLoginData,
  { rejectValue: string }
>('user/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await loginUserApi({ email, password });
    if (!response.success) {
      return rejectWithValue('Неверный email или пароль');
    }
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      const message = error.message || '';
      if (
        message.includes('401') ||
        message.toLowerCase().includes('unauthorized')
      ) {
        return rejectWithValue('Неверный email или пароль');
      }
      if (message.includes('400')) {
        return rejectWithValue('Неверные данные');
      }
      if (message.includes('Network') || message.includes('Failed to fetch')) {
        return rejectWithValue('Ошибка подключения к серверу');
      }
      return rejectWithValue(message);
    }
    return rejectWithValue('Ошибка подключения к серверу');
  }
});

export const fetchUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      if (!response?.success) {
        return rejectWithValue('Не удалось загрузить данные пользователя');
      }
      return response.user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        const message = error.message || '';
        if (
          message.includes('401') ||
          message.toLowerCase().includes('unauthorized')
        ) {
          return rejectWithValue('');
        }
        if (
          message.includes('Network') ||
          message.includes('Failed to fetch')
        ) {
          return rejectWithValue('Ошибка подключения к серверу');
        }
        return rejectWithValue(message);
      }
      return rejectWithValue('Ошибка подключения к серверу');
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/update', async (userData, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(userData);
    if (!response?.success) {
      return rejectWithValue('Не удалось обновить данные');
    }
    return response.user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      const message = error.message || '';
      if (message.includes('Network') || message.includes('Failed to fetch')) {
        return rejectWithValue('Ошибка подключения к серверу');
      }
      return rejectWithValue(message);
    }
    return rejectWithValue('Ошибка подключения к серверу');
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Не удалось выйти');
      }
      return rejectWithValue('Не удалось выйти');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthChecked = true;
    },
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Ошибка регистрации';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Неверный email или пароль';
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;

        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Не удалось выйти';
        state.isAuthChecked = true;
      });
  }
});

export const { clearUser, setAuthChecked, clearError } = userSlice.actions;
export default userSlice.reducer;
