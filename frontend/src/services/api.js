import axios from 'axios'
import useAuthStore from '../store/authStore'

// IMPORTANT: Do NOT use a full http://localhost:5000/api URL here.
// Using '/api' means every request goes through the Vite dev-server proxy
// (vite.config.js → server.proxy), which forwards it to Express on port 5000.
// Because the proxy is server-to-server, the browser never makes a cross-origin
// request, so CORS is never an issue in development.
//
// In production, set VITE_API_URL to your deployed API URL, e.g.:
//   VITE_API_URL=https://api.myapp.com/api
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false   // we use Bearer token, not cookies
})

// ─── Request interceptor — attach JWT ─────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response interceptor — handle 401 ───────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear local auth state and redirect
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
