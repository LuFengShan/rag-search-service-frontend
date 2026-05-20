import React, { useEffect, useState } from 'react'
import { Upload, Search, Filter, FileText, Trash2, Eye, MoreVertical, Plus, CheckSquare, Square, Grid, List, ArrowUpDown } from 'lucide-react'
import { useDocumentStore } from '../../stores/documentStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Skeleton } from '../../components/ui/Skeleton'
import { useDropzone } from 'react-dropzone'

export const DocumentsPage: React.FC = () => {
  const { documents, isLoading, uploadProgress, fetchDocuments, uploadDocument, deleteDocument } = useDocumentStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date')
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const filteredDocuments = documents
    .filter((doc) => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title)
      if (sortBy === 'date') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sortBy === 'size') return b.file_size - a.file_size
      return 0
    })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      indexed: { variant: 'success', label: '已索引' },
      processing: { variant: 'warning', label: '处理中' },
      uploading: { variant: 'primary', label: '上传中' },
      failed: { variant: 'danger', label: '失败' }
    }
    const config = variants[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant} className="text-xs px-2 py-0.5">{config.label}</Badge>
  }

  const getFileIcon = (fileType: string) => {
    const colors: Record<string, string> = {
      pdf: 'text-red-600',
      docx: 'text-blue-600',
      doc: 'text-blue-600',
      pptx: 'text-orange-600',
      ppt: 'text-orange-600'
    }
    return <FileText className={`w-5 h-5 ${colors[fileType] || 'text-primary-600'}`} />
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedDocs)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedDocs(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedDocs.size === filteredDocuments.length) {
      setSelectedDocs(new Set())
    } else {
      setSelectedDocs(new Set(filteredDocuments.map((doc) => doc.id)))
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">文档管理</h1>
          <p className="text-sm text-gray-600">管理知识库中的文档，支持批量上传和智能解析</p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)} className="shadow-sm">
          <Plus className="w-4 h-4 mr-1.5" />
          上传文档
        </Button>
      </div>

      <Card className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Input
              placeholder="搜索文档名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">全部状态</option>
            <option value="indexed">已索引</option>
            <option value="processing">处理中</option>
            <option value="failed">失败</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="date">按时间排序</option>
            <option value="name">按名称排序</option>
            <option value="size">按大小排序</option>
          </select>

          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {selectedDocs.size > 0 && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
            <span className="text-sm text-primary-700 font-medium">
              已选择 {selectedDocs.size} 个文档
            </span>
            <Button variant="danger" size="sm">
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              批量删除
            </Button>
            <Button variant="secondary" size="sm">
              批量移动
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedDocs(new Set())}>
              取消
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="rectangular" height={72} />
              ))}
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">暂无文档</p>
              <p className="text-sm text-gray-400 mb-4">上传文档以开始构建知识库</p>
              <Button onClick={() => setIsUploadModalOpen(true)}>
                <Upload className="w-4 h-4 mr-1.5" />
                上传文档
              </Button>
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600">
                <div className="w-8">
                  <button onClick={toggleSelectAll} className="text-gray-400 hover:text-gray-600">
                    {selectedDocs.size === filteredDocuments.length && filteredDocuments.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-primary-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="flex-1">文档名称</div>
                <div className="w-20">类型</div>
                <div className="w-20">大小</div>
                <div className="w-20">状态</div>
                <div className="w-20">片段数</div>
                <div className="w-24">更新时间</div>
                <div className="w-20">操作</div>
              </div>

              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-lg transition-colors group"
                >
                  <div className="w-8">
                    <button onClick={() => toggleSelect(doc.id)} className="text-gray-400 hover:text-gray-600">
                      {selectedDocs.has(doc.id) ? (
                        <CheckSquare className="w-4 h-4 text-primary-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex-1 flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {getFileIcon(doc.file_type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 truncate">{doc.title}</div>
                      <div className="text-xs text-gray-500">上传者：{doc.uploaded_by}</div>
                    </div>
                  </div>

                  <div className="w-20 text-sm text-gray-600">
                    {doc.file_type.toUpperCase()}
                  </div>

                  <div className="w-20 text-sm text-gray-600">
                    {formatFileSize(doc.file_size)}
                  </div>

                  <div className="w-20">
                    {getStatusBadge(doc.status)}
                  </div>

                  <div className="w-20 text-sm text-gray-600">
                    {doc.chunks} 个
                  </div>

                  <div className="w-24 text-sm text-gray-500">
                    {doc.created_at.split(' ')[0]}
                  </div>

                  <div className="w-20">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="预览">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="p-2 text-gray-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all hover:shadow-md group cursor-pointer"
                  onClick={() => toggleSelect(doc.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      {getFileIcon(doc.file_type)}
                    </div>
                    {selectedDocs.has(doc.id) && (
                      <CheckSquare className="w-5 h-5 text-primary-600" />
                    )}
                  </div>

                  <div className="mb-2">
                    <h3 className="font-medium text-gray-900 truncate mb-1">{doc.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(doc.status)}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>{doc.file_type.toUpperCase()}</span>
                      <span>{formatFileSize(doc.file_size)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{doc.chunks} 个片段</span>
                      <span>{doc.created_at.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>共 {filteredDocuments.length} 个文档</span>
          <div className="flex items-center gap-4">
            <span>已选择 {selectedDocs.size} 项</span>
          </div>
        </div>
      </Card>

      <UploadModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        uploadDocument={uploadDocument}
        uploadProgress={uploadProgress}
      />
    </div>
  )
}

interface UploadModalProps {
  open: boolean
  onClose: () => void
  uploadDocument: (file: File) => Promise<void>
  uploadProgress: number
}

const UploadModal: React.FC<UploadModalProps> = ({ open, onClose, uploadDocument, uploadProgress }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-powerpoint': ['.ppt']
    },
    maxFiles: 1
  })

  const handleUpload = async () => {
    if (selectedFile) {
      await uploadDocument(selectedFile)
      setSelectedFile(null)
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="上传文档" size="lg">
      <div className="space-y-4">
        {!selectedFile ? (
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
              ${isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              }
            `}
          >
            <input {...getInputProps()} />
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className={`w-8 h-8 ${isDragActive ? 'text-primary-600' : 'text-gray-400'}`} />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isDragActive ? '拖拽文件到此处' : '拖拽文件到此处，或点击选择'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              支持 PDF、Word、PowerPoint 等格式
            </p>
            <Button variant="secondary" size="sm">
              选择文件
            </Button>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {uploadProgress > 0 && (
              <div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span className="font-medium">上传进度</span>
                  <span className="text-primary-600 font-medium">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                {uploadProgress < 100 && (
                  <p className="text-xs text-gray-500 mt-2">正在上传，请稍候...</p>
                )}
                {uploadProgress === 100 && (
                  <p className="text-xs text-success-500 mt-2">上传完成，正在处理文档...</p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile || uploadProgress > 0}>
            {uploadProgress > 0 ? '上传中...' : '开始上传'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
