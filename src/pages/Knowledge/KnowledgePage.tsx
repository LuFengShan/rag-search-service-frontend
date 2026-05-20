import React, { useEffect, useState } from 'react'
import { Database, Plus, Settings, Trash2, FileText, Clock, MoreVertical, Edit2, Eye, CheckCircle2 } from 'lucide-react'
import { useKnowledgeStore } from '../../stores/knowledgeStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'

export const KnowledgePage: React.FC = () => {
  const { knowledgeBases, isLoading, fetchKnowledgeBases, createKnowledgeBase, deleteKnowledgeBase } = useKnowledgeStore()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newKBName, setNewKBName] = useState('')
  const [newKBDescription, setNewKBDescription] = useState('')

  useEffect(() => {
    fetchKnowledgeBases()
  }, [fetchKnowledgeBases])

  const handleCreate = async () => {
    if (newKBName.trim()) {
      await createKnowledgeBase({
        name: newKBName,
        description: newKBDescription
      })
      setNewKBName('')
      setNewKBDescription('')
      setIsCreateModalOpen(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">知识库管理</h1>
          <p className="text-sm text-gray-600">创建和管理多个知识库，分类存储不同类型的文档</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="shadow-sm">
          <Plus className="w-4 h-4 mr-1.5" />
          创建知识库
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-64">
              <div className="h-32 bg-gray-100 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </Card>
          ))}
        </div>
      ) : knowledgeBases.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
            <Database className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-2 text-lg font-medium">暂无知识库</p>
          <p className="text-sm text-gray-400 mb-6">创建您的第一个知识库，开始构建智能问答系统</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            创建知识库
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          {knowledgeBases.map((kb) => (
            <Card key={kb.id} className="flex flex-col hover:shadow-lg transition-shadow duration-200 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Database className="w-7 h-7 text-primary-600" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={kb.status === 'active' ? 'success' : 'default'} className="text-xs px-2 py-0.5">
                    {kb.status === 'active' ? '启用' : '停用'}
                  </Badge>
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 mb-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{kb.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{kb.description}</p>
              </div>

              <div className="space-y-2 mb-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{kb.document_count}</span>
                  <span>个文档</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{kb.embedding_model}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>更新于 {kb.updated_at.split(' ')[0]}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" className="flex-1">
                  <Settings className="w-3.5 h-3.5 mr-1" />
                  配置
                </Button>
                <Button variant="ghost" size="sm">
                  <Eye className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteKnowledgeBase(kb.id)}
                  className="opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-danger-500" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CreateKnowledgeBaseModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
        name={newKBName}
        setName={setNewKBName}
        description={newKBDescription}
        setDescription={setNewKBDescription}
      />
    </div>
  )
}

interface CreateKnowledgeBaseModalProps {
  open: boolean
  onClose: () => void
  onCreate: () => void
  name: string
  setName: (value: string) => void
  description: string
  setDescription: (value: string) => void
}

const CreateKnowledgeBaseModal: React.FC<CreateKnowledgeBaseModalProps> = ({
  open,
  onClose,
  onCreate,
  name,
  setName,
  description,
  setDescription
}) => {
  return (
    <Modal open={open} onClose={onClose} title="创建知识库" size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            知识库名称 <span className="text-danger-500">*</span>
          </label>
          <Input
            placeholder="输入知识库名称"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            描述
          </label>
          <textarea
            placeholder="输入知识库描述，帮助用户理解知识库的用途"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg
                     text-gray-900 placeholder-gray-400 resize-none
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-primary-800">
              <p className="font-medium mb-1">创建后您可以：</p>
              <ul className="space-y-1 text-primary-700">
                <li>• 上传文档并自动进行向量化处理</li>
                <li>• 配置检索参数和 Embedding 模型</li>
                <li>• 设置知识库访问权限</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button onClick={onCreate} disabled={!name.trim()}>
            <Plus className="w-4 h-4 mr-1" />
            创建知识库
          </Button>
        </div>
      </div>
    </Modal>
  )
}
