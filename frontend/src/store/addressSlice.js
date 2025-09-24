// src/store/addressSlice.js
'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const fetchAddresses = createAsyncThunk(
  'address/fetchAddresses',
  async (token, thunkAPI) => {
    try {
      if (typeof window === 'undefined') return [];
      const res = await axios.get(`${BASE_URL}/api/address/my`, { headers: { Authorization: `Bearer ${token}` } });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
    }
  }
);

export const saveNewAddress = createAsyncThunk(
  'address/saveNewAddress',
  async ({ data, token }, thunkAPI) => {
    try {
      if (typeof window === 'undefined') return;
      const res = await axios.post(`${BASE_URL}/api/address/save`, data, { headers: { Authorization: `Bearer ${token}` } });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to save address');
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState: { addresses: [], loading: false },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAddresses.fulfilled, (state, action) => { state.addresses = action.payload; })
      .addCase(saveNewAddress.fulfilled, (state, action) => { state.addresses.push(action.payload); });
  },
});

export default addressSlice.reducer;
