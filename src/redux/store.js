import { configureStore } from '@reduxjs/toolkit'
import productReducer from './slice/cartSlice'
export const store = configureStore({
  reducer: {
    cart: productReducer
  },
})