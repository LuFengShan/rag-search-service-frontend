import { create } from 'zustand'
import { Conversation, Answer } from '../types'
import { mockQAHistory, generateMockAnswer } from '../services/mock/qa'

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
  conversations: mockQAHistory,
  isLoading: false,
  setQuestion: (question: string) => {
    set({ currentQuestion: question })
  },
  submitQuestion: async () => {
    const { currentQuestion, conversations } = get()
    if (!currentQuestion.trim()) return

    const newConversation: Conversation = {
      id: Date.now().toString(),
      question: currentQuestion,
      answer: null,
      isLoading: true,
      timestamp: new Date().toISOString()
    }

    set({
      conversations: [...conversations, newConversation],
      currentQuestion: '',
      isLoading: true
    })

    setTimeout(() => {
      const answer = generateMockAnswer(currentQuestion)
      set((state) => ({
        conversations: state.conversations.map((conv) =>
          conv.id === newConversation.id
            ? { ...conv, answer, isLoading: false }
            : conv
        ),
        isLoading: false
      }))
    }, 1500)
  },
  clearHistory: () => {
    set({ conversations: [] })
  }
}))
