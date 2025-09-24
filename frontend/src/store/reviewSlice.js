// src/store/reviewSlice.js
'use client';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ✅ AsyncThunk
export const createReview = createAsyncThunk(
  'review/createReview',
  async ({ productId, formData }, thunkAPI) => {
    try {
      // localStorage sirf browser me available
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const res = await axios.post(
        `${BASE_URL}/api/products/${productId}/reviews`,
        formData,
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
          // axios FormData ke liye khud Content-Type set karega
        }
      );
      return res.data; // <- backend se naya review
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    loading: false,
    success: false,
    error: null,
    reviews: [],
  },
  reducers: {
    resetReview: (state) => {
      state.success = false;
      state.error = null;
    },
    setReviews: (state, action) => {
      state.reviews = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        if (action.payload) {
          const review = {
            ...action.payload,
            name: action.payload.name || 'Anonymous',
            rating: action.payload.rating || 0,
            verified: action.payload.verified ?? false,
            createdAt: action.payload.createdAt || new Date().toISOString(),
            media: action.payload.media || [],
          };

          state.reviews = [review, ...state.reviews]; // top pe add
        }
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetReview, setReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
