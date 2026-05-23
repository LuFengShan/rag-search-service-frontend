import api from './api'
import { ApiResponse, QuestionRequest, Answer, PagedResponse, QuestionRecord, ConversationSession, ConversationMessage } from '../types'

export const askQuestion = (data: QuestionRequest) =>
  api.post<ApiResponse<Answer>>('/qa/question', data).then((res) => res.data)

export const getHistory = (page = 0, pageSize = 10) =>
  api.get<ApiResponse<PagedResponse<QuestionRecord>>>('/qa/history', { params: { page, pageSize } }).then((res) => res.data)

export const getSessions = () =>
  api.get<ApiResponse<ConversationSession[]>>('/qa/sessions').then((res) => res.data)

export const getSessionMessages = (sessionId: string) =>
  api.get<ApiResponse<ConversationMessage[]>>(`/qa/sessions/${sessionId}/messages`).then((res) => res.data)

export const deleteSession = (sessionId: string) =>
  api.delete<ApiResponse<null>>(`/qa/sessions/${sessionId}`).then((res) => res.data)
