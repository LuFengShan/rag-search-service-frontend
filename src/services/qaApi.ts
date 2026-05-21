import api from './api'
import { ApiResponse, QuestionRequest, Answer, PagedResponse, QuestionRecord } from '../types'

export const askQuestion = (data: QuestionRequest) =>
  api.post<ApiResponse<Answer>>('/qa/question', data).then((res) => res.data)

export const getHistory = (page = 0, pageSize = 10) =>
  api.get<ApiResponse<PagedResponse<QuestionRecord>>>('/qa/history', { params: { page, pageSize } }).then((res) => res.data)
