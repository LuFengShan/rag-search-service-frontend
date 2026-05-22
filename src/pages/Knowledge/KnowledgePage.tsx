import React, { useEffect, useState } from 'react'
import { Database, Plus, Settings, Trash2, Clock, MoreVertical, Edit2, Eye, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { useKnowledgeStore } from '../../stores/knowledgeStore'
import { KnowledgeBase } from '../../types'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'

export const KnowledgePage: React.FC = () => {
  const { knowledgeBases, isLoading, fetchKnowledgeBases, createKnowledgeBase, updateKnowledgeBase, deleteKnowledgeBase } = useKnowledgeStore()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [editingKB, setEditingKB] = useState<KnowledgeBase | null>(null)
  const [viewingKB, setViewingKB] = useState<KnowledgeBase | null>(null)
  const [newKBName, setNewKBName] = useState('')
  const [newKBDescription, setNewKBDescription] = useState('')
  const [newKBDocType, setNewKBDocType] = useState('')
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchKnowledgeBases()
  }, [fetchKnowledgeBases])

  const handleCreate = async () => {
    if (!newKBName.trim()) {
      setFormError('请输入知识库名称')
      return
    }
    setIsSubmitting(true)
    setFormError('')
    try {
      await createKnowledgeBase({
        name: newKBName,
        description: newKBDescription,
        docType: newKBDocType || undefined,
      })
      setNewKBName('')
      setNewKBDescription('')
      setNewKBDocType('')
      setIsCreateModalOpen(false)
    } catch {
      setFormError('创建失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEdit = (kb: KnowledgeBase) => {
    setEditingKB(kb)
    setEditName(kb.name)
    setEditDesc(kb.description || '')
    setFormError('')
    setIsEditModalOpen(true)
  }

  const openView = (kb: KnowledgeBase) => {
    setViewingKB(kb)
    setIsViewOpen(true)
  }

  const handleEdit = async () => {
    if (!editingKB || !editName.trim()) {
      setFormError('请输入知识库名称')
      return
    }
    setIsSubmitting(true)
    setFormError('')
    try {
      await updateKnowledgeBase(editingKB.id, { name: editName, description: editDesc })
      setIsEditModalOpen(false)
      setEditingKB(null)
    } catch {
      setFormError('更新失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确定要删除知识库"${name}"吗？此操作不可恢复。`)) return
    try {
      await deleteKnowledgeBase(id)
    } catch {
      alert('删除失败，请稍后重试')
    }
  }

  const formatDateTime = (dateStr: string | undefined) =>
    dateStr ? new Date(dateStr).toLocaleString('zh-CN') : '-'

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">知识库管理</h1>
          <p className="text-sm text-gray-600">创建和管理多个知识库，分类存储不同类型的文档</p>
        </div>
        <Button
          onClick={() => {
            setNewKBName('')
            setNewKBDescription('')
            setNewKBDocType('')
            setFormError('')
            setIsCreateModalOpen(true)
          }}
          className="shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          创建知识库
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-64">
              <div className="h-32 bg-gray-100 rounded-lg animate-pulse mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
              <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
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
                  <Badge variant="success" className="text-xs px-2 py-0.5">启用</Badge>
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 mb-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{kb.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{kb.description || '暂无描述'}</p>
              </div>

              <div className="space-y-2 mb-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{kb.embeddingModel || '-'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>更新于 {kb.updatedAt ? new Date(kb.updatedAt).toLocaleDateString('zh-CN') : '-'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => openEdit(kb)}>
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  编辑
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openView(kb)}>
                  <Eye className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(kb.id, kb.name)}
                  className="opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-danger-500" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="创建知识库" size="md">
        <div className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2 p-3 bg-danger-50 border border-danger-200 rounded-lg text-sm text-danger-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {formError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              知识库名称 <span className="text-danger-500">*</span>
            </label>
            <Input
              placeholder="输入知识库名称"
              value={newKBName}
              onChange={(e) => setNewKBName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
            <textarea
              placeholder="输入知识库描述"
              value={newKBDescription}
              onChange={(e) => setNewKBDescription(e.target.value)}
              rows={3}
              className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">文档类型</label>
            <select
              value={newKBDocType}
              onChange={(e) => setNewKBDocType(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">通用类型（支持 PDF/Word/PPT/TXT 等）</option>
              <option value="CAR_MD">卖车知识库（仅限 Markdown .md 文件）</option>
            </select>
          </div>

          {newKBDocType === 'CAR_MD' && (
            <div className="flex items-start gap-2 p-3 bg-warning-50 border border-warning-200 rounded-lg text-sm text-warning-700">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-0.5">卖车知识库说明</p>
                <ul className="space-y-0.5 text-warning-600 text-xs">
                  <li>• 仅接受 .md 格式文件，请使用固定的车系MD模板</li>
                  <li>• 每个文件代表一个车系，包含YAML frontmatter元数据</li>
                  <li>• Agent 将自动切换为汽车销售顾问角色</li>
                </ul>
              </div>
            </div>
          )}

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
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>取消</Button>
            <Button onClick={handleCreate} loading={isSubmitting} disabled={!newKBName.trim()}>
              <Plus className="w-4 h-4 mr-1" />创建知识库
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="编辑知识库" size="md">
        <div className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2 p-3 bg-danger-50 border border-danger-200 rounded-lg text-sm text-danger-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {formError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              知识库名称 <span className="text-danger-500">*</span>
            </label>
            <Input
              placeholder="输入知识库名称"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
            <textarea
              placeholder="输入知识库描述"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              rows={3}
              className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>取消</Button>
            <Button onClick={handleEdit} loading={isSubmitting} disabled={!editName.trim()}>保存修改</Button>
          </div>
        </div>
      </Modal>

      <Modal open={isViewOpen} onClose={() => setIsViewOpen(false)} title="知识库详情" size="lg">
        {viewingKB && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500">知识库名称</label>
                <p className="text-sm text-gray-900 font-medium mt-1">{viewingKB.name}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">知识库 ID</label>
                <p className="text-sm text-gray-900 mt-1 truncate">{viewingKB.id}</p>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-500">描述</label>
                <p className="text-sm text-gray-900 mt-1">{viewingKB.description || '暂无描述'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Embedding 模型</label>
                <p className="text-sm text-gray-900 mt-1">{viewingKB.embeddingModel || '未配置'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">配置</label>
                <p className="text-sm text-gray-900 mt-1">{viewingKB.config || '默认配置'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">创建者</label>
                <p className="text-sm text-gray-900 mt-1 truncate">{viewingKB.createdBy || '-'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">创建时间</label>
                <p className="text-sm text-gray-900 mt-1">{formatDateTime(viewingKB.createdAt)}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">更新时间</label>
                <p className="text-sm text-gray-900 mt-1">{formatDateTime(viewingKB.updatedAt)}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">状态</label>
                <div className="mt-1"><Badge variant="success" className="text-xs">启用</Badge></div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setIsViewOpen(false)}>关闭</Button>
              <Button onClick={() => {
                setIsViewOpen(false)
                if (viewingKB) openEdit(viewingKB)
              }}>
                <Edit2 className="w-4 h-4 mr-1.5" />编辑此知识库
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
