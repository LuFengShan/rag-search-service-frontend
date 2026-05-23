import React, { useEffect, useRef, useState } from 'react'
import { Send, Sparkles, Trash2, RefreshCw, Copy, Check, User, Bot, Database, Plus, MessageSquare, Clock, ChevronRight, Loader2 } from 'lucide-react'
import { useQAStore } from '../../stores/qaStore'
import { useKnowledgeStore } from '../../stores/knowledgeStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { decodeHtml } from '../../lib/utils'

export const HomePage: React.FC = () => {
  const {
    currentQuestion,
    conversations,
    isLoading,
    selectedKnowledgeBaseId,
    currentSessionId,
    sessions,
    sessionsLoading,
    setQuestion,
    setKnowledgeBaseId,
    submitQuestion,
    newSession,
    loadSessions,
    loadSessionMessages,
    deleteSession,
  } = useQAStore()

  const { knowledgeBases, fetchKnowledgeBases } = useKnowledgeStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    fetchKnowledgeBases()
    loadSessions()
  }, [fetchKnowledgeBases, loadSessions])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversations])

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleReAsk = (question: string) => {
    setQuestion(question)
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement | null
    if (textarea) textarea.focus()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentQuestion.trim() || isLoading) return
    submitQuestion()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    if (diff < 86400000) {
      return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="h-[calc(100vh-64px)] flex relative">
      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} bg-white border-r border-gray-100 flex-shrink-0 transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-sm text-gray-700">对话列表</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-3">
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => {
              newSession()
              loadSessions()
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            新对话
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {sessionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400">暂无对话记录</p>
            </div>
          ) : (
            sessions.map((s) => (
              <div
                key={s.sessionId}
                onClick={() => loadSessionMessages(s.sessionId)}
                className={`group flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all mb-1 ${
                  currentSessionId === s.sessionId
                    ? 'bg-primary-50 border border-primary-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-900 font-medium truncate">{s.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {s.lastMessageAt ? formatTime(s.lastMessageAt) : ''}
                    </span>
                    <span className="text-[10px] text-gray-400">{s.messageCount} 条</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteSession(s.sessionId)
                  }}
                  className="p-1 text-gray-300 hover:text-danger-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute left-0 top-24 z-20 flex items-center gap-1 px-2 py-3 bg-white border border-gray-200 rounded-r-lg shadow-md hover:bg-primary-50 hover:border-primary-300 transition-all group"
          title="展开对话列表"
        >
          <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
          <span className="text-xs text-gray-500 group-hover:text-primary-600">
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          </span>
        </button>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-6 py-4 flex-shrink-0 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">智能问答助手</h1>
              <p className="text-xs text-gray-500">基于 RAG 技术的企业私有知识库问答系统</p>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
              <Database className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <select
                value={selectedKnowledgeBaseId}
                onChange={(e) => setKnowledgeBaseId(e.target.value)}
                className="bg-transparent text-xs text-gray-700 focus:outline-none max-w-[140px] truncate"
              >
                <option value="">全部知识库</option>
                {knowledgeBases.map((kb) => (
                  <option key={kb.id} value={kb.id}>{kb.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {conversations.length === 0 ? (
            <div className="max-w-2xl mx-auto pt-16">
              <Card className="text-center py-12 px-8">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">开始智能问答</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    输入您的问题，我可以帮您快速查找知识库中的相关内容
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-left">
                    {['请假流程是什么？', '财务报销标准', '系统架构说明', '如何申请设备'].map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuestion(suggestion)}
                        className="p-3 text-left bg-gray-50 hover:bg-primary-50 border border-gray-200 hover:border-primary-300 rounded-xl transition-all text-xs text-gray-700 hover:text-primary-700"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6 py-6">
              {conversations.map((conv) => (
                <div key={conv.id} className="space-y-4">
                  <div className="flex justify-end">
                    <div className="flex items-end gap-3 max-w-[80%]">
                      <div className="flex-1">
                        <div className="flex items-center justify-end gap-2 mb-1">
                          <span className="text-[10px] text-gray-400">
                            {new Date(conv.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <User className="w-3 h-3" />
                            <span>我</span>
                          </div>
                        </div>
                        <div className="bg-primary-500 text-white px-4 py-3 rounded-2xl rounded-tr-md shadow-sm group/question relative">
                          <p className="text-sm leading-relaxed">{conv.question}</p>
                          <div className="absolute -bottom-7 right-0 flex items-center gap-1 opacity-0 group-hover/question:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleCopy(conv.question, `q-${conv.id}`)}
                              className="flex items-center gap-1 px-2 py-1 text-[10px] text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors"
                            >
                              {copiedId === `q-${conv.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              {copiedId === `q-${conv.id}` ? '已复制' : '复制'}
                            </button>
                            <button
                              onClick={() => handleReAsk(conv.question)}
                              className="flex items-center gap-1 px-2 py-1 text-[10px] text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors"
                            >
                              <RefreshCw className="w-3 h-3" />
                              重新提问
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {conv.isLoading ? (
                    <div className="flex">
                      <div className="flex items-end gap-3 max-w-[80%]">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-md">
                            <div className="space-y-2">
                              <Skeleton variant="text" width="70%" />
                              <Skeleton variant="text" width="50%" />
                              <Skeleton variant="text" width="80%" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : conv.answer ? (
                    <div className="flex">
                      <div className="flex items-end gap-3 max-w-[80%]">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <Card className="border border-gray-200 rounded-2xl rounded-tl-md shadow-sm overflow-hidden">
                            <div className="px-4 py-3">
                              <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap group/answer relative">
                                {decodeHtml(conv.answer.answer)}
                                <div className="absolute -bottom-7 right-0 flex items-center gap-1 opacity-0 group-hover/answer:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleCopy(decodeHtml(conv.answer!.answer), `a-${conv.id}`)}
                                    className="flex items-center gap-1 px-2 py-1 text-[10px] text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors"
                                  >
                                    {copiedId === `a-${conv.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    {copiedId === `a-${conv.id}` ? '已复制' : '复制'}
                                  </button>
                                  <button
                                    onClick={() => handleReAsk(conv.question)}
                                    className="flex items-center gap-1 px-2 py-1 text-[10px] text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                    重新提问
                                  </button>
                                </div>
                              </div>
                            </div>

                            {conv.answer.sources && conv.answer.sources.length > 0 && (
                              <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Badge variant="success" className="text-[10px]">
                                      置信度 {Math.round(conv.answer.confidence * 100)}%
                                    </Badge>
                                    <Badge variant="primary" className="text-[10px]">
                                      {conv.answer.sources.length} 个参考文档
                                    </Badge>
                                </div>
                                <div className="space-y-1.5">
                                  <p className="text-[10px] font-medium text-gray-500">参考文档：</p>
                                  {conv.answer.sources.map((source, idx) => (
                                    <div key={idx} className="p-2.5 bg-white border border-gray-200 rounded-lg">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-primary-600">{source.documentTitle}</span>
                                        <Badge variant={source.confidence > 0.9 ? 'success' : 'warning'} className="text-[10px]">
                                          {Math.round(source.confidence * 100)}%
                                        </Badge>
                                      </div>
                                      <p className="text-[11px] text-gray-500 italic leading-relaxed">
                                        "{decodeHtml(source.chunkContent)}"
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </Card>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="bg-white border-t border-gray-100 px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={currentQuestion}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="输入您的问题，按 Enter 发送..."
                  rows={1}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-primary-200 transition-all shadow-sm"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
              <Button
                type="submit"
                disabled={!currentQuestion.trim() || isLoading}
                loading={isLoading}
                className="px-5 py-3 rounded-2xl shadow-sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
