import api from './api'
import { ApiResponse, Document, PagedResponse } from '../types'

export const getDocuments = (page = 0, pageSize = 10, knowledgeBaseId?: string, search?: string) => {
  const params: Record<string, string | number> = { page, pageSize }
  if (knowledgeBaseId) params.knowledgeBaseId = knowledgeBaseId
  if (search) params.search = search
  return api.get<ApiResponse<PagedResponse<Document>>>('/documents', { params }).then((res) => res.data)
}

export const getDocument = (id: string) =>
  api.get<ApiResponse<Document>>(`/documents/${id}`).then((res) => res.data)

export const uploadDocument = (file: File, knowledgeBaseId: string) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('knowledgeBaseId', knowledgeBaseId)
  return api
    .post<ApiResponse<Document>>('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          return percent
        }
      },
    })
    .then((res) => res.data)
}

export const deleteDocument = (id: string) =>
  api.delete<ApiResponse<null>>(`/documents/${id}`).then((res) => res.data)
