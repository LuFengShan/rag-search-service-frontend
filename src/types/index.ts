export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PagedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  userId: string
  username: string
  email: string
  role: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface User {
  id: string
  username: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  username: string
  email: string
  password: string
  role: string
}

export interface UpdateUserRequest {
  username?: string
  email?: string
  role?: string
}

export interface KnowledgeBase {
  id: string
  name: string
  description: string
  embeddingModel: string
  config: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CreateKnowledgeBaseRequest {
  name: string
  description: string
  docType?: string
}

export interface UpdateKnowledgeBaseRequest {
  name?: string
  description?: string
}

export interface Document {
  id: string
  title: string
  filePath: string
  fileType: string
  fileSize: number
  metadata: string
  knowledgeBaseId: string
  uploadedBy: string
  status: string
  createdAt: string
  updatedAt: string
  chunkCount: number
}

export interface Answer {
  id: string
  questionId: string
  answer: string
  sources: Source[]
  confidence: number
  createdAt: string
}

export interface Source {
  documentId: string
  documentTitle: string
  chunkContent: string
  confidence: number
}

export interface Conversation {
  id: string
  question: string
  answer: Answer | null
  isLoading: boolean
  timestamp: string
}

export interface AnalyticsOverview {
  totalQuestions: number
  todayQuestions: number
  avgResponseTime: number
  satisfactionRate: number
  hotDocuments: Array<{ id: string; title: string; count: number }>
  hotQuestions: Array<{ question: string; count: number }>
}

export interface TrendData {
  date: string
  questions: number
  answers: number
}

export interface TrendResponse {
  data: TrendData[]
}

export interface QuestionRequest {
  question: string
  knowledgeBaseId?: string
  sessionId?: string
}

export interface QuestionRecord {
  id: string
  userId: string
  question: string
  knowledgeBaseId: string | null
  sessionId: string | null
  status: 'PENDING' | 'ANSWERED' | 'FAILED'
  createdAt: string
}

export interface ConversationSession {
  sessionId: string
  title: string
  messageCount: number
  lastMessageAt: string
}

export interface ConversationMessage {
  questionId: string
  question: string
  answer: string | null
  status: string
  createdAt: string
}

export interface UploadError {
  fileName: string
  reason: string
}

export interface BulkUploadResponse {
  totalFiles: number
  successCount: number
  failCount: number
  successList: Document[]
  errors: UploadError[]
}
