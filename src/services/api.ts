import axios, { AxiosRequestConfig } from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let failedRequests: Array<{ resolve: (token: string) => void; reject: (error: unknown) => void }> = []

const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken')
}

const setToken = (token: string): void => {
  localStorage.setItem('token', token)
}

const setRefreshToken = (refreshToken: string): void => {
  localStorage.setItem('refreshToken', refreshToken)
}

const handleRefreshToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await axios.post<{ success: boolean; data: { token: string; refreshToken: string } }>(
    '/api/auth/refresh',
    { refreshToken }
  )

  if (!response.data.success) {
    throw new Error('Failed to refresh token')
  }

  const { token, refreshToken: newRefreshToken } = response.data.data
  setToken(token)
  setRefreshToken(newRefreshToken)

  return token
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedRequests.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers = originalRequest.headers || {}
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }).catch((err) => {
          return Promise.reject(err)
        })
      }

      isRefreshing = true
      originalRequest._retry = true

      try {
        const newToken = await handleRefreshToken()

        failedRequests.forEach((request) => request.resolve(newToken))
        failedRequests = []

        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        failedRequests.forEach((request) => request.reject(refreshError))
        failedRequests = []

        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userId')
        localStorage.removeItem('username')
        localStorage.removeItem('email')
        localStorage.removeItem('role')
        window.location.href = '/login'

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
