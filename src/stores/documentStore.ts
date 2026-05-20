import { create } from 'zustand'
import { Document } from '../types'
import { mockDocuments } from '../services/mock/documents'

interface DocumentStore {
  documents: Document[]
  currentDocument: Document | null
  uploadProgress: number
  isLoading: boolean
  fetchDocuments: () => Promise<void>
  uploadDocument: (file: File) => Promise<void>
  deleteDocument: (id: string) => Promise<void>
  setCurrentDocument: (doc: Document | null) => void
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  currentDocument: null,
  uploadProgress: 0,
  isLoading: false,
  fetchDocuments: async () => {
    set({ isLoading: true })
    await new Promise((resolve) => setTimeout(resolve, 500))
    set({ documents: mockDocuments, isLoading: false })
  },
  uploadDocument: async (file: File) => {
    set({ uploadProgress: 0 })
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      set({ uploadProgress: i })
    }
    const newDoc: Document = {
      id: Date.now().toString(),
      title: file.name,
      file_type: file.name.split('.').pop() || 'unknown',
      file_size: file.size,
      status: 'processing',
      chunks: 0,
      knowledge_base_id: '1',
      uploaded_by: '当前用户',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    set((state) => ({ documents: [...state.documents, newDoc], uploadProgress: 0 }))
  },
  deleteDocument: async (id: string) => {
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id)
    }))
  },
  setCurrentDocument: (doc: Document | null) => {
    set({ currentDocument: doc })
  }
}))
