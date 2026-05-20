import { create } from 'zustand'
import { Document } from '../types'
import * as documentApi from '../services/documentApi'

interface DocumentStore {
  documents: Document[]
  currentDocument: Document | null
  uploadProgress: number
  isLoading: boolean
  fetchDocuments: (knowledgeBaseId?: string, search?: string) => Promise<void>
  uploadDocument: (file: File, knowledgeBaseId: string) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
  setCurrentDocument: (doc: Document | null) => void
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  currentDocument: null,
  uploadProgress: 0,
  isLoading: false,

  fetchDocuments: async (knowledgeBaseId, search) => {
    set({ isLoading: true })
    try {
      const res = await documentApi.getDocuments(0, 100, knowledgeBaseId, search)
      set({ documents: res.data.list, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  uploadDocument: async (file, knowledgeBaseId) => {
    set({ uploadProgress: 0 })
    try {
      const res = await documentApi.uploadDocument(file, knowledgeBaseId)
      set((state) => ({
        documents: [...state.documents, res.data],
        uploadProgress: 0,
      }))
    } catch {
      set({ uploadProgress: 0 })
    }
  },

  deleteDocument: async (id) => {
    await documentApi.deleteDocument(id)
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    }))
  },

  setCurrentDocument: (doc) => {
    set({ currentDocument: doc })
  },
}))
