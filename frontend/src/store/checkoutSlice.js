// src/store/checkoutSlice.js
'use client';
import { createSlice } from '@reduxjs/toolkit';

const getSavedState = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('checkoutState');
    return saved ? JSON.parse(saved) : null;
  }
  return null;
};

const initialState = getSavedState() || {
  orderDetails: null,
  cartFromCheckout: [],
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setOrderDetails: (state, action) => {
      state.orderDetails = action.payload;
      if (typeof window !== 'undefined') localStorage.setItem('checkoutState', JSON.stringify(state));
    },
    clearOrderDetails: (state) => {
      state.orderDetails = null;
      if (typeof window !== 'undefined') localStorage.setItem('checkoutState', JSON.stringify(state));
    },
    setCartFromCheckout: (state, action) => {
      state.cartFromCheckout = action.payload;
      if (typeof window !== 'undefined') localStorage.setItem('checkoutState', JSON.stringify(state));
    },
    clearCartFromCheckout: (state) => {
      state.cartFromCheckout = [];
      if (typeof window !== 'undefined') localStorage.setItem('checkoutState', JSON.stringify(state));
    },
    resetCheckoutState: (state) => {
      state.orderDetails = null;
      state.cartFromCheckout = [];
      if (typeof window !== 'undefined') localStorage.removeItem('checkoutState');
    },
  },
});

export const {
  setOrderDetails,
  clearOrderDetails,
  setCartFromCheckout,
  clearCartFromCheckout,
  resetCheckoutState,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
