import api from './api'
import {
  ApiResponse,
  KnowledgeBase,
  CreateKnowledgeBaseRequest,
  UpdateKnowledgeBaseRequest,
} from '../types'

export const getKnowledgeBases = () =>
  api.get<ApiResponse<KnowledgeBase[]>>('/knowledge').then((res) => res.data)

export const getKnowledgeBase = (id: string) =>
  api.get<ApiResponse<KnowledgeBase>>(`/knowledge/${id}`).then((res) => res.data)

export const createKnowledgeBase = (data: CreateKnowledgeBaseRequest) =>
  api.post<ApiResponse<KnowledgeBase>>('/knowledge', data).then((res) => res.data)

export const updateKnowledgeBase = (id: string, data: UpdateKnowledgeBaseRequest) =>
  api.put<ApiResponse<KnowledgeBase>>(`/knowledge/${id}`, data).then((res) => res.data)

export const deleteKnowledgeBase = (id: string) =>
  api.delete<ApiResponse<null>>(`/knowledge/${id}`).then((res) => res.data)
