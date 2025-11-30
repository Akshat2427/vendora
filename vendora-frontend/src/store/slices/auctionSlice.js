import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiRequest } from '../../services/api'

// Async thunk to fetch auction by ID
export const fetchAuctionById = createAsyncThunk(
  'auctions/fetchById',
  async (auctionId, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/auctions/${auctionId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch auction')
      }
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  auctions: [],
  loading: false,
  error: null
}

const auctionSlice = createSlice({
  name: 'auctions',
  initialState,
  reducers: {
    clearAuctions: (state) => {
      state.auctions = []
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuctionById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAuctionById.fulfilled, (state, action) => {
        state.loading = false
        // Check if auction already exists, if not add it
        const existingIndex = state.auctions.findIndex(
          (auction) => auction.id === action.payload.id
        )
        if (existingIndex >= 0) {
          state.auctions[existingIndex] = action.payload
        } else {
          state.auctions.push(action.payload)
        }
      })
      .addCase(fetchAuctionById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearAuctions } = auctionSlice.actions
export default auctionSlice.reducer

