import { create } from 'zustand'
import { Conversation, Answer, ConversationSession, ConversationMessage } from '../types'
import * as qaApi from '../services/qaApi'

interface QAStore {
  currentQuestion: string
  conversations: Conversation[]
  isLoading: boolean
  selectedKnowledgeBaseId: string
  currentSessionId: string
  sessions: ConversationSession[]
  sessionsLoading: boolean
  setQuestion: (question: string) => void
  setKnowledgeBaseId: (id: string) => void
  setCurrentSessionId: (id: string) => void
  submitQuestion: () => Promise<void>
  clearHistory: () => void
  newSession: () => void
  loadSessions: () => Promise<void>
  loadSessionMessages: (sessionId: string) => Promise<void>
  deleteSession: (sessionId: string) => void
}

export const useQAStore = create<QAStore>((set, get) => ({
  currentQuestion: '',
  conversations: [],
  isLoading: false,
  selectedKnowledgeBaseId: '',
  currentSessionId: '',
  sessions: [],
  sessionsLoading: false,

  setQuestion: (question: string) => {
    set({ currentQuestion: question })
  },

  setKnowledgeBaseId: (id: string) => {
    set({ selectedKnowledgeBaseId: id })
  },

  setCurrentSessionId: (id: string) => {
    set({ currentSessionId: id })
  },

  newSession: () => {
    set({ conversations: [], currentSessionId: '' })
  },

  loadSessions: async () => {
    set({ sessionsLoading: true })
    try {
      const res = await qaApi.getSessions()
      set({ sessions: res.data, sessionsLoading: false })
    } catch {
      set({ sessionsLoading: false })
    }
  },

  loadSessionMessages: async (sessionId: string) => {
    set({ isLoading: true })
    try {
      const res = await qaApi.getSessionMessages(sessionId)
      const conversations: Conversation[] = res.data.map((msg: ConversationMessage) => ({
        id: msg.questionId,
        question: msg.question,
        answer: msg.answer
          ? {
              id: msg.questionId,
              questionId: msg.questionId,
              answer: msg.answer,
              sources: [],
              confidence: 0,
              createdAt: msg.createdAt,
            }
          : null,
        isLoading: false,
        timestamp: msg.createdAt,
      }))
      set({ conversations, currentSessionId: sessionId })
    } catch {
    } finally {
      set({ isLoading: false })
    }
  },

  deleteSession: (sessionId: string) => {
    qaApi.deleteSession(sessionId).catch(() => {})
    set((state) => ({
      sessions: state.sessions.filter((s) => s.sessionId !== sessionId),
    }))
    if (get().currentSessionId === sessionId) {
      set({ conversations: [], currentSessionId: '' })
    }
  },

  submitQuestion: async () => {
    const { currentQuestion, conversations, selectedKnowledgeBaseId, currentSessionId } = get()
    if (!currentQuestion.trim()) return

    const convId = Date.now().toString()
    const newConversation: Conversation = {
      id: convId,
      question: currentQuestion,
      answer: null,
      isLoading: true,
      timestamp: new Date().toISOString(),
    }

    set({
      conversations: [...conversations, newConversation],
      currentQuestion: '',
      isLoading: true,
    })

    try {
      const requestBody: { question: string; knowledgeBaseId?: string; sessionId?: string } = {
        question: currentQuestion,
      }
      if (selectedKnowledgeBaseId) {
        requestBody.knowledgeBaseId = selectedKnowledgeBaseId
      }
      if (currentSessionId) {
        requestBody.sessionId = currentSessionId
      }

      const res = await qaApi.askQuestion(requestBody)
      const backendAnswer = res.data

      const answer: Answer = {
        id: convId,
        questionId: convId,
        answer: backendAnswer.answer,
        sources: backendAnswer.sources || [],
        confidence: backendAnswer.confidence,
        createdAt: new Date().toISOString(),
      }

      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === convId ? { ...conv, answer, isLoading: false } : conv
        ),
        isLoading: false,
      }))

      get().loadSessions()
    } catch {
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === convId
            ? {
                ...conv,
                answer: {
                  id: convId,
                  questionId: convId,
                  answer: '抱歉，请求失败，请稍后重试。',
                  sources: [],
                  confidence: 0,
                  createdAt: new Date().toISOString(),
                },
                isLoading: false,
              }
            : conv
        ),
        isLoading: false,
      }))
    }
  },

  clearHistory: () => {
    set({ conversations: [] })
  },
}))
