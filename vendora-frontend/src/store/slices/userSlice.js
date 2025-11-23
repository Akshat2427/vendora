import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  isAuthenticated: false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload
      state.isAuthenticated = !!action.payload
    },
    clearUser: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
    }
  }
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer

