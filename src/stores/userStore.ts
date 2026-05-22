import { create } from 'zustand'
import { LoginResponse } from '../types'
import * as authApi from '../services/authApi'

interface UserStore {
  userId: string | null
  username: string | null
  email: string | null
  role: string | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isInitialized: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  initFromStorage: () => void
  setTokens: (token: string, refreshToken: string) => void
}

export const useUserStore = create<UserStore>((set) => ({
  userId: null,
  username: null,
  email: null,
  role: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,

  initFromStorage: () => {
    const token = localStorage.getItem('token')
    const refreshToken = localStorage.getItem('refreshToken')
    const userId = localStorage.getItem('userId')
    const username = localStorage.getItem('username')
    const email = localStorage.getItem('email')
    const role = localStorage.getItem('role')
    if (token && username) {
      set({ token, refreshToken, userId, username, email, role, isAuthenticated: true, isInitialized: true })
    } else {
      set({ isInitialized: true })
    }
  },

  login: async (username: string, password: string) => {
    set({ isLoading: true })
    try {
      const res = await authApi.login({ username, password })
      const data: LoginResponse = res.data
      localStorage.setItem('token', data.token)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('userId', data.userId)
      localStorage.setItem('username', data.username)
      localStorage.setItem('email', data.email)
      localStorage.setItem('role', data.role)
      set({
        token: data.token,
        refreshToken: data.refreshToken,
        userId: data.userId,
        username: data.username,
        email: data.email,
        role: data.role,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: async () => {
    try {
      await authApi.logout()
    } catch {
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userId')
      localStorage.removeItem('username')
      localStorage.removeItem('email')
      localStorage.removeItem('role')
      set({
        token: null,
        refreshToken: null,
        userId: null,
        username: null,
        email: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  },

  setTokens: (token: string, refreshToken: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', refreshToken)
    set({ token, refreshToken })
  },
}))
