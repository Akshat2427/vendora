import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authAPI, setToken, removeToken, getToken } from '../../services/api'

// Load user from token on app start
export const loadUserFromToken = createAsyncThunk(
  'user/loadFromToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken()
      if (!token) {
        return null
      }
      const response = await authAPI.me()
      if (!response || !response.user) {
        // Invalid response, remove token
        removeToken()
        return rejectWithValue('Invalid user data')
      }
      return response.user
    } catch (err) {
      // Token is invalid or expired, remove it
      console.warn('Failed to load user from token:', err.message)
      removeToken()
      return rejectWithValue(err.message)
    }
  }
)

// Login thunk
export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(email, password)
      setToken(response.token)
      return response.user
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Signup thunk
export const signupUser = createAsyncThunk(
  'user/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.signup(userData)
      setToken(response.token)
      return response.user
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Logout thunk
export const logoutUser = createAsyncThunk(
  'user/logout',
  async () => {
    try {
      await authAPI.logout()
      removeToken()
      return null
    } catch {
      // Even if logout fails on server, clear local token
      removeToken()
      return null
    }
  }
)

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null
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
      removeToken()
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Load user from token
      .addCase(loadUserFromToken.pending, (state) => {
        state.loading = true
      })
      .addCase(loadUserFromToken.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
        state.isAuthenticated = !!action.payload
      })
      .addCase(loadUserFromToken.rejected, (state) => {
        state.loading = false
        state.currentUser = null
        state.isAuthenticated = false
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null
        state.isAuthenticated = false
        state.error = null
      })
  }
})

export const { setUser, clearUser, clearError } = userSlice.actions
export default userSlice.reducer

