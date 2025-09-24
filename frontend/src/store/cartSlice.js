// src/store/cartSlice.js
'use client';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/cart`;

const authHeaders = () => ({
  headers: typeof window !== 'undefined'
    ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
    : {},
});

const prepareItemsForBackend = (items) =>
  Array.isArray(items)
    ? items
        .filter((item) => item && (item.product || item.productName))
        .map((item) => ({ ...item, discountPrice: item.discountPrice ?? item.price }))
    : [];

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL, authHeaders());
    return prepareItemsForBackend(response.data.items);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (items, thunkAPI) => {
  try {
    const payload = prepareItemsForBackend(items);
    const response = await axios.post(API_URL, { items: payload }, authHeaders());
    return prepareItemsForBackend(response.data.cart?.items);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateQuantity = createAsyncThunk('cart/updateQuantity', async ({ id, quantity }, thunkAPI) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, { quantity }, authHeaders());
    return prepareItemsForBackend(response.data.cart?.items);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (id, thunkAPI) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, authHeaders());
    return prepareItemsForBackend(response.data.cart?.items);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, thunkAPI) => {
  try {
    await axios.delete(API_URL, authHeaders());
    return [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const initialState = { items: [], status: 'idle', error: null };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearLocalCart: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchCart.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchCart.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(addToCart.pending, (state) => { state.status = 'loading'; })
      .addCase(addToCart.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(addToCart.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(updateQuantity.pending, (state) => { state.status = 'loading'; })
      .addCase(updateQuantity.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(updateQuantity.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(removeFromCart.pending, (state) => { state.status = 'loading'; })
      .addCase(removeFromCart.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(removeFromCart.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(clearCart.pending, (state) => { state.status = 'loading'; })
      .addCase(clearCart.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(clearCart.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; });
  },
});

export const { clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartCount = (state) =>
  state.cart.items.reduce((total, item) => total + (item.quantity || 0), 0);
