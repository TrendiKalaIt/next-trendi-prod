
 'use client';
 import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      
    },
    logout(state) {
      state.user = null;
      
    },
    updateUser(state, action) {
      const updatedUser = { ...state.user, ...action.payload };
      state.user = updatedUser;
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.user;

export default authSlice.reducer;
