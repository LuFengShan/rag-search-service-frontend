import React, { useEffect, useRef, useState } from 'react'
import { Send, Sparkles, History, Trash2, Bookmark, Share2, RefreshCw, User, Bot, Database, Clock, ChevronLeft, ChevronRight, Loader2, MessageSquare, X } from 'lucide-react'
import { useQAStore } from '../../stores/qaStore'
import { useKnowledgeStore } from '../../stores/knowledgeStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { Modal } from '../../components/ui/Modal'
import { decodeHtml } from '../../lib/utils'
import * as qaApi from '../../services/qaApi'
import { QuestionRecord } from '../../types'

export const HomePage: React.FC = () => {
  const {
    currentQuestion,
    conversations,
    isLoading,
    selectedKnowledgeBaseId,
    setQuestion,
    setKnowledgeBaseId,
    submitQuestion,
    clearHistory
  } = useQAStore()

  const { knowledgeBases, fetchKnowledgeBases } = useKnowledgeStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [historyRecords, setHistoryRecords] = useState<QuestionRecord[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyPage, setHistoryPage] = useState(0)
  const [historyTotal, setHistoryTotal] = useState(0)
  const [historyTotalPages, setHistoryTotalPages] = useState(0)
  const pageSize = 10

  useEffect(() => {
    fetchKnowledgeBases()
  }, [fetchKnowledgeBases])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversations])

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

  const loadHistory = async (page = 0) => {
    setHistoryLoading(true)
    setHistoryPage(page)
    try {
      const res = await qaApi.getHistory(page, pageSize)
      setHistoryRecords(res.data.list)
      setHistoryTotal(res.data.total)
      setHistoryTotalPages(res.data.totalPages)
    } catch {
    } finally {
      setHistoryLoading(false)
    }
  }

  const openHistory = () => {
    setIsHistoryOpen(true)
    loadHistory(0)
  }

  const useHistoryItem = (q: QuestionRecord) => {
    setQuestion(q.question)
    if (q.knowledgeBaseId) {
      setKnowledgeBaseId(q.knowledgeBaseId)
    }
    setIsHistoryOpen(false)
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      <div className="px-6 py-6 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">智能问答助手</h1>
              <p className="text-gray-500 mt-0.5">基于 RAG 技术的企业私有知识库问答系统</p>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <Database className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <select
                value={selectedKnowledgeBaseId}
                onChange={(e) => setKnowledgeBaseId(e.target.value)}
                className="bg-transparent text-sm text-gray-700 focus:outline-none min-w-[120px] max-w-[180px] truncate"
              >
                <option value="">全部知识库</option>
                {knowledgeBases.map((kb) => (
                  <option key={kb.id} value={kb.id}>{kb.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-52">
        {conversations.length === 0 ? (
          <div className="max-w-3xl mx-auto">
            <Card className="text-center py-16 px-8">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  开始智能问答
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  输入您的问题，我可以帮您快速查找知识库中的相关内容，为您提供精准的答案和参考文档
                </p>
                <div className="grid grid-cols-2 gap-3 text-left">
                  {[
                    '请假流程是什么？',
                    '财务报销标准',
                    '系统架构说明',
                    '如何申请设备'
                  ].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuestion(suggestion)}
                      className="p-4 text-left bg-gray-50 hover:bg-primary-50 border border-gray-200 hover:border-primary-300 rounded-xl transition-all duration-200 text-sm text-gray-700 hover:text-primary-700 hover:shadow-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {conversations.map((conv) => (
              <div key={conv.id} className="space-y-4">
                <div className="flex justify-end">
                  <div className="flex items-end gap-3 max-w-[85%]">
                    <div className="flex-1">
                      <div className="flex items-center justify-end gap-2 mb-1.5">
                        <span className="text-xs text-gray-400">
                          {new Date(conv.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <User className="w-3.5 h-3.5" />
                          <span className="font-medium">我</span>
                        </div>
                      </div>
                      <div className="bg-primary-500 text-white px-5 py-3.5 rounded-2xl rounded-tr-md shadow-sm">
                        <p className="text-gray-50 text-sm leading-relaxed">{conv.question}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {conv.isLoading ? (
                  <div className="flex">
                    <div className="flex items-end gap-3 max-w-[85%]">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Bot className="w-3.5 h-3.5" />
                            <span className="font-medium">智能助手</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            正在检索...
                          </span>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 px-5 py-4 rounded-2xl rounded-tl-md">
                          <div className="space-y-3">
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
                    <div className="flex items-end gap-3 max-w-[85%]">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Bot className="w-3.5 h-3.5" />
                            <span className="font-medium">智能助手</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(conv.answer.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <Card className="border border-gray-200 rounded-2xl rounded-tl-md shadow-sm overflow-hidden">
                          <div className="px-5 py-4">
                            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                              {decodeHtml(conv.answer.answer)}
                            </div>
                          </div>

                          {conv.answer.sources && conv.answer.sources.length > 0 && (
                            <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Badge variant="success" className="text-xs">
                                    置信度 {Math.round(conv.answer.confidence * 100)}%
                                  </Badge>
                                  <Badge variant="primary" className="text-xs">
                                    {conv.answer.sources.length} 个参考文档
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="收藏">
                                    <Bookmark className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="分享">
                                    <Share2 className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="重新生成">
                                    <RefreshCw className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-500">参考文档：</p>
                                {conv.answer.sources.map((source, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 bg-white border border-gray-200 rounded-xl"
                                  >
                                    <div className="flex items-center justify-between mb-1.5">
                                      <span className="text-sm font-medium text-primary-600">
                                        {source.documentTitle}
                                      </span>
                                      <Badge variant={source.confidence > 0.9 ? 'success' : 'warning'} className="text-xs">
                                        {Math.round(source.confidence * 100)}%
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-gray-600 italic leading-relaxed">
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

      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-gray-100 px-4 py-4 z-10 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={currentQuestion}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您的问题，按 Enter 发送..."
                rows={1}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl
                         text-gray-900 placeholder-gray-400 resize-none
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-primary-200
                         transition-all duration-200 shadow-sm"
                style={{ minHeight: '52px', maxHeight: '140px' }}
              />
            </div>
            <Button
              type="submit"
              disabled={!currentQuestion.trim() || isLoading}
              loading={isLoading}
              className="px-6 py-3.5 rounded-2xl shadow-sm"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>

          <div className="flex items-center justify-between mt-3 px-2">
            <div className="flex items-center gap-4">
              <button
                onClick={openHistory}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-600 transition-colors"
              >
                <History className="w-3.5 h-3.5" />
                查看历史
              </button>
              <span className="text-xs text-gray-400">{conversations.length} 条对话</span>
            </div>
            {conversations.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-danger-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                清空对话
              </button>
            )}
          </div>
        </div>
      </div>

      <Modal open={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} title="历史会话" size="lg">
        <div className="space-y-4">
          {historyLoading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              加载中...
            </div>
          ) : historyRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-1 font-medium">暂无历史记录</p>
              <p className="text-sm text-gray-400">您提问后，历史记录将显示在这里</p>
            </div>
          ) : (
            <>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {historyRecords.map((record) => (
                  <button
                    key={record.id}
                    onClick={() => useHistoryItem(record)}
                    className="w-full text-left p-4 bg-white hover:bg-primary-50 border border-gray-200 hover:border-primary-300 rounded-xl transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-sm text-gray-900 font-medium line-clamp-2 group-hover:text-primary-700">
                        {record.question}
                      </p>
                      <Badge
                        variant={
                          record.status === 'ANSWERED' ? 'success' :
                          record.status === 'FAILED' ? 'danger' : 'warning'
                        }
                        className="text-xs flex-shrink-0"
                      >
                        {record.status === 'ANSWERED' ? '已回答' :
                         record.status === 'FAILED' ? '失败' : '处理中'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {record.createdAt ? new Date(record.createdAt).toLocaleString('zh-CN') : '-'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm text-gray-500">
                <span>共 {historyTotal} 条记录</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadHistory(historyPage - 1)}
                    disabled={historyPage === 0}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-xs"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    上一页
                  </button>
                  <span className="px-2 text-xs">{historyPage + 1} / {Math.max(historyTotalPages, 1)}</span>
                  <button
                    onClick={() => loadHistory(historyPage + 1)}
                    disabled={historyPage + 1 >= historyTotalPages}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-xs"
                  >
                    下一页
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
