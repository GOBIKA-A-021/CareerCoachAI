import api from './api'

export const authService = {
  // Returns { user, token } — callers should use response.user / response.token directly
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data.data   // response.data.data = { token, user }
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data.data   // response.data.data = { token, user }
  },

  googleLogin: async (googleData) => {
    const response = await api.post('/auth/google', googleData)
    return response.data.data   // response.data.data = { token, user }
  },


  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData)
    return response.data
  },

  requestPasswordReset: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  resetPassword: async (data) => {
    const response = await api.post('/auth/reset-password', data)
    return response.data
  }
}
