// src/redux/store.js
'use client'; // Required for Next.js 15 client-side store

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

// SSR-safe storage
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
const createNoopStorage = () => {
  return {
    getItem(_key) { return Promise.resolve(null); },
    setItem(_key, value) { return Promise.resolve(value); },
    removeItem(_key) { return Promise.resolve(); },
  };
};
const storage = typeof window !== 'undefined'
  ? createWebStorage('local')
  : createNoopStorage();

// Reducers
import loaderReducer from './loaderSlice.js';
import productReducer from './productSlice.js';
import wishlistReducer from './wishlistSlice.js';
import cartReducer from './cartSlice.js';
import checkoutReducer from './checkoutSlice.js';
import authReducer from './authSlice.js';
import reviewReducer from './reviewSlice.js';
import orderReducer from './orderSlice.js';
import addressReducer from './addressSlice.js';

// 1️⃣ Combine reducers
const rootReducer = combineReducers({
  loader: loaderReducer,
  review: reviewReducer,
  auth: authReducer,
  wishlist: wishlistReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
  product: productReducer,
  order: orderReducer,
  address: addressReducer,
});

// 2️⃣ Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'checkout'], // Only persist these slices
};

// 3️⃣ Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4️⃣ Store setup
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// 5️⃣ Persistor
export const persistor = persistStore(store);

// 6️⃣ Export store
export default store;
