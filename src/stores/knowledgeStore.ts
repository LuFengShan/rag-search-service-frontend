import { create } from 'zustand'
import { KnowledgeBase } from '../types'
import * as knowledgeApi from '../services/knowledgeApi'

interface KnowledgeStore {
  knowledgeBases: KnowledgeBase[]
  currentKnowledgeBase: KnowledgeBase | null
  isLoading: boolean
  fetchKnowledgeBases: () => Promise<void>
  createKnowledgeBase: (data: { name: string; description: string }) => Promise<void>
  updateKnowledgeBase: (id: string, data: { name?: string; description?: string }) => Promise<void>
  deleteKnowledgeBase: (id: string) => Promise<void>
  setCurrentKnowledgeBase: (kb: KnowledgeBase | null) => void
}

export const useKnowledgeStore = create<KnowledgeStore>((set, get) => ({
  knowledgeBases: [],
  currentKnowledgeBase: null,
  isLoading: false,

  fetchKnowledgeBases: async () => {
    set({ isLoading: true })
    try {
      const res = await knowledgeApi.getKnowledgeBases()
      set({ knowledgeBases: res.data, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  createKnowledgeBase: async (data) => {
    const res = await knowledgeApi.createKnowledgeBase(data)
    set((state) => ({ knowledgeBases: [...state.knowledgeBases, res.data] }))
  },

  updateKnowledgeBase: async (id, data) => {
    const res = await knowledgeApi.updateKnowledgeBase(id, data)
    set((state) => ({
      knowledgeBases: state.knowledgeBases.map((kb) =>
        kb.id === id ? res.data : kb
      ),
    }))
  },

  deleteKnowledgeBase: async (id) => {
    await knowledgeApi.deleteKnowledgeBase(id)
    set((state) => ({
      knowledgeBases: state.knowledgeBases.filter((kb) => kb.id !== id),
    }))
  },

  setCurrentKnowledgeBase: (kb) => {
    set({ currentKnowledgeBase: kb })
  },
}))
