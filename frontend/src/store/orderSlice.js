// src/store/orderSlice.js
'use client';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';


// Place order
export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async ({ orderPayload, token }, { rejectWithValue }) => {
    try {
      const isLoggedIn = Boolean(token);
      const url = isLoggedIn
        ? `${BASE_URL}/api/orders/place`
        : `${BASE_URL}/api/orders/guest-place-order`;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(isLoggedIn && { Authorization: `Bearer ${token}` }),
        },
      };
      const res = await axios.post(url, orderPayload, config);
      return res.data.order;
    } catch (err) {
      console.error('Place order error:', err);
      return rejectWithValue(err.response?.data?.message || 'Failed to place order');
    }
  }
);

// Fetch my orders
export const fetchMyOrders = createAsyncThunk(
  'order/fetchMyOrders',
  async (token, { rejectWithValue }) => {
    try {
      if (!token) return [];
      const res = await axios.get(`${BASE_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.orders;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    loading: false,
    error: null,
    currentOrder: null,
    buyNowProduct: null,
    myOrders: [],
    showOrderHistory: false,
  },
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
    },
    setBuyNowProduct: (state, action) => {
      state.buyNowProduct = action.payload;
    },
    clearBuyNowProduct: (state) => {
      state.buyNowProduct = null;
    },
    toggleOrderHistory: (state, action) => {
      state.showOrderHistory = action.payload;
    },
    setOrderDetails: (state, action) => {
      state.currentOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(placeOrder.fulfilled, (state, action) => { state.loading = false; state.currentOrder = action.payload; })
      .addCase(placeOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.myOrders = action.payload; })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const {
  clearOrder,
  setBuyNowProduct,
  clearBuyNowProduct,
  toggleOrderHistory,
  setOrderDetails,
} = orderSlice.actions;

export default orderSlice.reducer;

// Selectors
export const selectPlacedOrder = (state) => state.order.currentOrder;
export const selectMyOrders = (state) => state.order.myOrders;
export const selectOrderLoading = (state) => state.order.loading;
export const selectOrderError = (state) => state.order.error;
export const selectOrderHistoryVisibility = (state) => state.order.showOrderHistory;
