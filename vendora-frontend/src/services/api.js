const API_BASE = 'http://localhost:5000'

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('authToken')
}

// Set token in localStorage
export const setToken = (token) => {
  localStorage.setItem('authToken', token)
}

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem('authToken')
}

// Make authenticated API request
export const apiRequest = async (url, options = {}) => {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers
  })

  return response
}

// Authentication API calls
export const authAPI = {
  signup: async (userData) => {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.errors?.join(', ') || data.error || 'Signup failed')
    }
    return data
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Login failed')
    }
    return data
  },

  logout: async () => {
    const response = await apiRequest('/auth/logout', {
      method: 'POST'
    })
    const data = await response.json()
    return data
  },

  me: async () => {
    const response = await apiRequest('/auth/me')
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.error || `Failed to get user info (${response.status})`
      throw new Error(errorMessage)
    }
    return await response.json()
  }
}

