import { create } from 'zustand'
import { KnowledgeBase } from '../types'
import { mockKnowledgeBases } from '../services/mock/knowledge'

interface KnowledgeStore {
  knowledgeBases: KnowledgeBase[]
  currentKnowledgeBase: KnowledgeBase | null
  isLoading: boolean
  fetchKnowledgeBases: () => Promise<void>
  createKnowledgeBase: (data: Partial<KnowledgeBase>) => Promise<void>
  updateKnowledgeBase: (id: string, data: Partial<KnowledgeBase>) => Promise<void>
  deleteKnowledgeBase: (id: string) => Promise<void>
  setCurrentKnowledgeBase: (kb: KnowledgeBase | null) => void
}

export const useKnowledgeStore = create<KnowledgeStore>((set, get) => ({
  knowledgeBases: [],
  currentKnowledgeBase: null,
  isLoading: false,
  fetchKnowledgeBases: async () => {
    set({ isLoading: true })
    await new Promise((resolve) => setTimeout(resolve, 500))
    set({ knowledgeBases: mockKnowledgeBases, isLoading: false })
  },
  createKnowledgeBase: async (data: Partial<KnowledgeBase>) => {
    const newKB: KnowledgeBase = {
      id: Date.now().toString(),
      name: data.name || '新知识库',
      description: data.description || '',
      embedding_model: data.embedding_model || 'BGE-large-zh',
      document_count: 0,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    set((state) => ({ knowledgeBases: [...state.knowledgeBases, newKB] }))
  },
  updateKnowledgeBase: async (id: string, data: Partial<KnowledgeBase>) => {
    set((state) => ({
      knowledgeBases: state.knowledgeBases.map((kb) =>
        kb.id === id ? { ...kb, ...data, updated_at: new Date().toISOString() } : kb
      )
    }))
  },
  deleteKnowledgeBase: async (id: string) => {
    set((state) => ({
      knowledgeBases: state.knowledgeBases.filter((kb) => kb.id !== id)
    }))
  },
  setCurrentKnowledgeBase: (kb: KnowledgeBase | null) => {
    set({ currentKnowledgeBase: kb })
  }
}))
