import React, { useEffect, useRef } from 'react'
import { Send, Sparkles, History, Trash2, Bookmark, Share2, RefreshCw, User, Bot } from 'lucide-react'
import { useQAStore } from '../../stores/qaStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'

export const HomePage: React.FC = () => {
  const {
    currentQuestion,
    conversations,
    isLoading,
    setQuestion,
    submitQuestion,
    clearHistory
  } = useQAStore()

  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      <div className="px-6 py-6 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">智能问答助手</h1>
              <p className="text-gray-500 mt-0.5">基于 RAG 技术的企业私有知识库问答系统</p>
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
                            {new Date(conv.answer.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <Card className="border border-gray-200 rounded-2xl rounded-tl-md shadow-sm overflow-hidden">
                          <div className="px-5 py-4">
                            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                              {conv.answer.answer}
                            </div>
                          </div>

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
                                      {source.document_title}
                                    </span>
                                    <Badge variant={source.confidence > 0.9 ? 'success' : 'warning'} className="text-xs">
                                      {Math.round(source.confidence * 100)}%
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-600 italic leading-relaxed">
                                    "{source.chunk_content}"
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
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

          {conversations.length > 0 && (
            <div className="flex items-center justify-between mt-3 px-2">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-600 transition-colors">
                  <History className="w-3.5 h-3.5" />
                  查看历史
                </button>
                <span className="text-xs text-gray-400">{conversations.length} 条对话</span>
              </div>
              <button
                onClick={clearHistory}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-danger-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                清空对话
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
