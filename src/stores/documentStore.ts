import { create } from 'zustand'
import { Document, BulkUploadResponse } from '../types'
import * as documentApi from '../services/documentApi'

interface DocumentStore {
  documents: Document[]
  currentDocument: Document | null
  uploadProgress: number
  isLoading: boolean
  bulkUploadResult: BulkUploadResponse | null
  fetchDocuments: (knowledgeBaseId?: string, search?: string) => Promise<void>
  uploadDocument: (file: File, knowledgeBaseId: string) => Promise<void>
  uploadDocuments: (files: File[], knowledgeBaseId: string) => Promise<BulkUploadResponse>
  uploadFolder: (zipFile: File, knowledgeBaseId: string) => Promise<BulkUploadResponse>
  deleteDocument: (id: string) => Promise<void>
  setCurrentDocument: (doc: Document | null) => void
  clearBulkUploadResult: () => void
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  currentDocument: null,
  uploadProgress: 0,
  isLoading: false,
  bulkUploadResult: null,

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

  uploadDocuments: async (files, knowledgeBaseId) => {
    set({ uploadProgress: 0 })
    try {
      const res = await documentApi.uploadDocuments(files, knowledgeBaseId)
      if (res.data) {
        set((state) => ({
          documents: [...res.data.successList, ...state.documents],
          bulkUploadResult: res.data,
        }))
      }
      return res.data
    } catch {
      throw new Error('批量上传失败')
    }
  },

  uploadFolder: async (zipFile, knowledgeBaseId) => {
    set({ uploadProgress: 0 })
    try {
      const res = await documentApi.uploadFolder(zipFile, knowledgeBaseId)
      if (res.data) {
        set((state) => ({
          documents: [...res.data.successList, ...state.documents],
          bulkUploadResult: res.data,
        }))
      }
      return res.data
    } catch {
      throw new Error('文件夹上传失败')
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

  clearBulkUploadResult: () => {
    set({ bulkUploadResult: null })
  },
}))
