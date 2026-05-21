import { create } from 'zustand'
import { Conversation, Answer } from '../types'
import * as qaApi from '../services/qaApi'

interface QAStore {
  currentQuestion: string
  conversations: Conversation[]
  isLoading: boolean
  selectedKnowledgeBaseId: string
  setQuestion: (question: string) => void
  setKnowledgeBaseId: (id: string) => void
  submitQuestion: () => Promise<void>
  clearHistory: () => void
}

export const useQAStore = create<QAStore>((set, get) => ({
  currentQuestion: '',
  conversations: [],
  isLoading: false,
  selectedKnowledgeBaseId: '',

  setQuestion: (question: string) => {
    set({ currentQuestion: question })
  },

  setKnowledgeBaseId: (id: string) => {
    set({ selectedKnowledgeBaseId: id })
  },

  submitQuestion: async () => {
    const { currentQuestion, conversations, selectedKnowledgeBaseId } = get()
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
      const requestBody: { question: string; knowledgeBaseId?: string } = {
        question: currentQuestion,
      }
      if (selectedKnowledgeBaseId) {
        requestBody.knowledgeBaseId = selectedKnowledgeBaseId
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
