import { create } from 'zustand'
import { LoginResponse } from '../types'
import * as authApi from '../services/authApi'

interface UserStore {
  userId: string | null
  username: string | null
  email: string | null
  role: string | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  initFromStorage: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  userId: null,
  username: null,
  email: null,
  role: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  initFromStorage: () => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const username = localStorage.getItem('username')
    const email = localStorage.getItem('email')
    const role = localStorage.getItem('role')
    if (token && username) {
      set({ token, userId, username, email, role, isAuthenticated: true })
    }
  },

  login: async (username: string, password: string) => {
    set({ isLoading: true })
    try {
      const res = await authApi.login({ username, password })
      const data: LoginResponse = res.data
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.userId)
      localStorage.setItem('username', data.username)
      localStorage.setItem('email', data.email)
      localStorage.setItem('role', data.role)
      set({
        token: data.token,
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

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    localStorage.removeItem('email')
    localStorage.removeItem('role')
    set({
      token: null,
      userId: null,
      username: null,
      email: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
    })
  },
}))
