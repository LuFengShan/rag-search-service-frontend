import api from './api'
import { ApiResponse, Document, PagedResponse, BulkUploadResponse } from '../types'

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

export const uploadDocuments = (files: File[], knowledgeBaseId: string) => {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))
  formData.append('knowledgeBaseId', knowledgeBaseId)
  return api
    .post<ApiResponse<BulkUploadResponse>>('/documents/batch', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data)
}

export const uploadFolder = (zipFile: File, knowledgeBaseId: string) => {
  const formData = new FormData()
  formData.append('file', zipFile)
  formData.append('knowledgeBaseId', knowledgeBaseId)
  return api
    .post<ApiResponse<BulkUploadResponse>>('/documents/upload-folder', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data)
}

export const exportDocuments = (titleFilter: string) => {
  return api.get('/documents/export', { params: { title: titleFilter }, responseType: 'arraybuffer' })
}

export const downloadDocument = async (id: string, filename: string) => {
  const res = await api.get(`/documents/${id}/download`, { responseType: 'blob' })
  const blob = new Blob([res.data])
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  const disposition = res.headers['content-disposition']
  let downloadFilename = filename
  if (disposition) {
    const match = disposition.match(/filename="(.+?)"/) || disposition.match(/filename=([^;]+)/)
    if (match) {
      downloadFilename = decodeURIComponent(match[1])
    }
  }
  link.setAttribute('download', downloadFilename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export const deleteDocument = (id: string) =>
  api.delete<ApiResponse<null>>(`/documents/${id}`).then((res) => res.data)
