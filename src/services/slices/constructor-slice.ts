import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient, TOrder } from '../../utils/types';
import { orderBurgerApi } from '../../utils/burger-api';
import { RootState } from '../../services/store';
import { nanoid } from '@reduxjs/toolkit';

type TCreateOrderApiResponse = {
  success: boolean;
  order: {
    _id: string;
    number: number;
    name: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  name: string;
};

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];

  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

export const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const makeOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('constructor/makeOrder', async (ingredientsIds, { rejectWithValue }) => {
  try {
    const response = (await orderBurgerApi(
      ingredientsIds
    )) as unknown as TCreateOrderApiResponse;

    if (!response.success) {
      return rejectWithValue('Failed to create order');
    }

    const order: TOrder = {
      _id: response.order._id,
      number: response.order.number,
      name: response.order.name,
      status: response.order.status,
      createdAt: response.order.createdAt,
      updatedAt: response.order.updatedAt,
      ingredients: ingredientsIds
    };

    return order;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Network error');
  }
});

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: {
      prepare: (item: TIngredient) => {
        const id = nanoid();
        return { payload: { id, ...item } };
      },
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      }
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },

    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const items = [...state.ingredients];
      const [movedItem] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, movedItem);
      state.ingredients = items;
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },

    clearOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(makeOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;

        state.bun = null;
        state.ingredients = [];
      })
      .addCase(makeOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload || 'Failed to create order';
      });
  }
});

const selectConstructorState = (state: RootState) => state.burgerConstructor;

export const selectConstructorItems = createSelector(
  [selectConstructorState],
  (state) => ({
    bun: state.bun,
    ingredients: state.ingredients
  })
);

export const selectOrderRequest = (state: RootState) =>
  state.burgerConstructor.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.burgerConstructor.orderModalData;
export const selectOrderError = (state: RootState) =>
  state.burgerConstructor.error;

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  clearOrderModal
} = constructorSlice.actions;

export default constructorSlice.reducer;
