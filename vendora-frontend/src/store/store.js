import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import auctionReducer from './slices/auctionSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    auctions: auctionReducer
  }
})

