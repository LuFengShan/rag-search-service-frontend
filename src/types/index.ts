export interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'maintainer' | 'user'
  avatar?: string
  created_at: string
}

export interface KnowledgeBase {
  id: string
  name: string
  description: string
  embedding_model: string
  document_count: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  title: string
  file_type: string
  file_size: number
  status: 'uploading' | 'processing' | 'indexed' | 'failed'
  chunks: number
  knowledge_base_id: string
  uploaded_by: string
  created_at: string
  updated_at: string
}

export interface DocumentChunk {
  id: string
  document_id: string
  chunk_index: number
  content: string
  created_at: string
}

export interface Question {
  id: string
  question: string
  user_id: string
  status: 'pending' | 'answered' | 'failed'
  created_at: string
}

export interface Answer {
  id: string
  question_id: string
  answer: string
  sources: Source[]
  confidence: number
  created_at: string
}

export interface Source {
  document_id: string
  document_title: string
  chunk_content: string
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
  total_questions: number
  avg_response_time: number
  satisfaction_rate: number
  today_questions: number
  hot_documents: Array<{id: string, title: string, count: number}>
  hot_questions: Array<{question: string, count: number}>
}

export interface TrendData {
  date: string
  questions: number
  answers: number
}

export type UserRole = 'admin' | 'maintainer' | 'user'
