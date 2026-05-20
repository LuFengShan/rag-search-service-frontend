import { create } from 'zustand'
import { User } from '../types'

interface UserStore {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: {
    id: '1',
    username: 'admin',
    email: 'admin@company.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    created_at: '2024-01-01 00:00:00'
  },
  isAuthenticated: true,
  login: async (username: string, password: string) => {
    set({
      user: {
        id: '1',
        username,
        email: `${username}@company.com`,
        role: 'admin',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        created_at: new Date().toISOString()
      },
      isAuthenticated: true
    })
  },
  logout: () => {
    set({ user: null, isAuthenticated: false })
  }
}))
