import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

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

type TCreateOrderState = {
  orderData: TOrder | null;
  orderNumber: number | null;
  loading: boolean;
  error: string | null;
};

type TFeedOrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  currentOrder: TOrder | null;
};

type TOrderState = TCreateOrderState & TFeedOrdersState;

type TFeedsResponse = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const initialState: TOrderState = {
  orderData: null,
  orderNumber: null,
  loading: false,
  error: null,
  orders: [],
  total: 0,
  totalToday: 0,
  currentOrder: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/create', async (ingredients, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredients);

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
      ingredients: ingredients
    };

    return order;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Network error');
  }
});

export const getFeeds = createAsyncThunk<
  TFeedsResponse,
  void,
  { rejectValue: string }
>('order/feeds', async (_, { rejectWithValue }) => {
  try {
    const response = await getFeedsApi();
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Failed to fetch feeds');
  }
});

export const getOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('order/userOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await getOrdersApi();
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Failed to fetch orders');
  }
});

export const getOrderByNumber = createAsyncThunk<
  { orders: TOrder[] },
  number,
  { rejectValue: string }
>('order/byNumber', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Failed to fetch order');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderData = null;
      state.orderNumber = null;
      state.error = null;
      state.loading = false;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderData = action.payload;
        state.orderNumber = action.payload.number;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error creating order';
      })

      .addCase(getFeeds.pending, (state) => {
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.error = action.payload || 'Error fetching feeds';
      })

      .addCase(getOrders.pending, (state) => {
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.error = action.payload || 'Error fetching orders';
      })

      .addCase(getOrderByNumber.pending, (state) => {
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        if (action.payload.orders.length > 0) {
          state.currentOrder = action.payload.orders[0];
        } else {
          state.currentOrder = null;
        }
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error = action.payload || 'Error fetching order';
      });
  }
});

export const { clearOrder, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
