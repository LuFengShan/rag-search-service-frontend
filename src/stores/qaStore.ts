import { create } from 'zustand'
import { Conversation, Answer } from '../types'
import * as qaApi from '../services/qaApi'

interface QAStore {
  currentQuestion: string
  conversations: Conversation[]
  isLoading: boolean
  setQuestion: (question: string) => void
  submitQuestion: () => Promise<void>
  clearHistory: () => void
}

export const useQAStore = create<QAStore>((set, get) => ({
  currentQuestion: '',
  conversations: [],
  isLoading: false,

  setQuestion: (question: string) => {
    set({ currentQuestion: question })
  },

  submitQuestion: async () => {
    const { currentQuestion, conversations } = get()
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
      const res = await qaApi.askQuestion({ question: currentQuestion })
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
