// src/redux/wishlistSlice.js
'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, thunkAPI) => {
    try {
      if (typeof window === 'undefined') return [];
      const token = localStorage.getItem('token');
      if (!token) return thunkAPI.rejectWithValue('No token found');
      const res = await axios.get(`${BASE_URL}/api/wishlist`, { headers: { Authorization: `Bearer ${token}` } });
      return res.data.data.map(item => item.product).filter(p => p && p._id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (product, thunkAPI) => {
    try {
      if (typeof window === 'undefined') return;
      await axios.post(`${BASE_URL}/api/wishlist`, { productId: product._id }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      return product;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, thunkAPI) => {
    try {
      if (typeof window === 'undefined') return;
      await axios.delete(`${BASE_URL}/api/wishlist/${productId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      return productId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchWishlist.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchWishlist.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchWishlist.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addToWishlist.pending, state => { state.error = null; })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        if (!state.items.find(item => item._id === action.payload._id)) state.items.push(action.payload);
      })
      .addCase(addToWishlist.rejected, (state, action) => { state.error = action.payload; })
      .addCase(removeFromWishlist.pending, state => { state.error = null; })
      .addCase(removeFromWishlist.fulfilled, (state, action) => { state.items = state.items.filter(item => item._id !== action.payload); })
      .addCase(removeFromWishlist.rejected, (state, action) => { state.error = action.payload; });
  },
});

export default wishlistSlice.reducer;
export const selectWishlistCount = state => state.wishlist.items.length;
