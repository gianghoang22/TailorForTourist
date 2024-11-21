
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slice/cartSlice.js';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});