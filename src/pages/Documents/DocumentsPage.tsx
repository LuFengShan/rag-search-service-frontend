import React, { useEffect, useState } from 'react'
import { Upload, Search, FileText, Trash2, Eye, Download, Plus, CheckSquare, Square, Grid, List, X, AlertCircle, FolderArchive, Files } from 'lucide-react'
import { useDocumentStore } from '../../stores/documentStore'
import { useKnowledgeStore } from '../../stores/knowledgeStore'
import { Document, BulkUploadResponse } from '../../types'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Skeleton } from '../../components/ui/Skeleton'
import { useDropzone } from 'react-dropzone'
import { downloadDocument } from '../../services/documentApi'

export const DocumentsPage: React.FC = () => {
  const { documents, isLoading, uploadProgress, fetchDocuments, uploadDocument, uploadDocuments, uploadFolder, deleteDocument } = useDocumentStore()
  const { knowledgeBases, fetchKnowledgeBases } = useKnowledgeStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date')
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set())
  const [selectedKBId, setSelectedKBId] = useState<string>('')
  const [isBatchDeleting, setIsBatchDeleting] = useState(false)

  useEffect(() => {
    fetchDocuments()
    fetchKnowledgeBases()
  }, [fetchDocuments, fetchKnowledgeBases])

  useEffect(() => {
    if (knowledgeBases.length > 0 && !selectedKBId) {
      setSelectedKBId(knowledgeBases[0].id)
    }
  }, [knowledgeBases, selectedKBId])

  const filteredDocuments = documents
    .filter((doc) => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title)
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === 'size') return b.fileSize - a.fileSize
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
      INDEXED: { variant: 'success', label: '已索引' },
      PROCESSING: { variant: 'warning', label: '处理中' },
      UPLOADING: { variant: 'primary', label: '上传中' },
      FAILED: { variant: 'danger', label: '失败' }
    }
    const config = variants[status] || { variant: 'default', label: status }
    return <Badge variant={config.variant} className="text-xs px-2 py-0.5">{config.label}</Badge>
  }

  const getFileIcon = (fileType: string) => {
    const colors: Record<string, string> = {
      pdf: 'text-red-600', docx: 'text-blue-600', doc: 'text-blue-600',
      pptx: 'text-orange-600', ppt: 'text-orange-600'
    }
    return <FileText className={`w-5 h-5 ${colors[fileType] || 'text-primary-600'}`} />
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedDocs)
    if (newSelected.has(id)) newSelected.delete(id)
    else newSelected.add(id)
    setSelectedDocs(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedDocs.size === filteredDocuments.length) {
      setSelectedDocs(new Set())
    } else {
      setSelectedDocs(new Set(filteredDocuments.map((doc) => doc.id)))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除该文档吗？')) return
    try {
      await deleteDocument(id)
    } catch {
      alert('删除失败')
    }
  }

  const handleDownload = async (doc: Document) => {
    try {
      const filename = doc.title ? `${doc.title}.${doc.fileType}` : `document.${doc.fileType}`
      await downloadDocument(doc.id, filename)
    } catch {
      alert('下载失败')
    }
  }

  const handleBatchDelete = async () => {
    if (selectedDocs.size === 0) return
    if (!confirm(`确定要删除选中的 ${selectedDocs.size} 个文档吗？`)) return
    setIsBatchDeleting(true)
    let successCount = 0
    for (const id of selectedDocs) {
      try {
        await deleteDocument(id)
        successCount++
      } catch {
        // continue
      }
    }
    setIsBatchDeleting(false)
    setSelectedDocs(new Set())
    alert(`已删除 ${successCount}/${selectedDocs.size} 个文档`)
  }

  const openPreview = (doc: Document) => {
    setPreviewDoc(doc)
    setIsPreviewOpen(true)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">文档管理</h1>
          <p className="text-sm text-gray-600">管理知识库中的文档，支持批量上传和智能解析</p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)} className="shadow-sm">
          <Plus className="w-4 h-4 mr-1.5" />上传文档
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
            <option value="INDEXED">已索引</option>
            <option value="PROCESSING">处理中</option>
            <option value="FAILED">失败</option>
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
            <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {selectedDocs.size > 0 && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
            <span className="text-sm text-primary-700 font-medium">已选择 {selectedDocs.size} 个文档</span>
            <Button variant="danger" size="sm" onClick={handleBatchDelete} loading={isBatchDeleting}>
              <Trash2 className="w-3.5 h-3.5 mr-1" />批量删除
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedDocs(new Set())}>取消</Button>
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
                <Upload className="w-4 h-4 mr-1.5" />上传文档
              </Button>
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-600">
                <div className="w-8">
                  <button onClick={toggleSelectAll} className="text-gray-400 hover:text-gray-600">
                    {selectedDocs.size === filteredDocuments.length && filteredDocuments.length > 0
                      ? <CheckSquare className="w-4 h-4 text-primary-600" />
                      : <Square className="w-4 h-4" />}
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
                <div key={doc.id} className="flex items-center gap-3 p-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-lg transition-colors group">
                  <div className="w-8">
                    <button onClick={() => toggleSelect(doc.id)} className="text-gray-400 hover:text-gray-600">
                      {selectedDocs.has(doc.id)
                        ? <CheckSquare className="w-4 h-4 text-primary-600" />
                        : <Square className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex-1 flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {getFileIcon(doc.fileType)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 truncate">{doc.title}</div>
                      <div className="text-xs text-gray-500">{doc.fileType?.toUpperCase()} · {formatFileSize(doc.fileSize)}</div>
                    </div>
                  </div>
                  <div className="w-20 text-sm text-gray-600">{doc.fileType?.toUpperCase()}</div>
                  <div className="w-20 text-sm text-gray-600">{formatFileSize(doc.fileSize)}</div>
                  <div className="w-20">{getStatusBadge(doc.status)}</div>
                  <div className="w-20 text-sm text-gray-600">{doc.chunkCount} 个</div>
                  <div className="w-24 text-sm text-gray-500">
                    {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('zh-CN') : '-'}
                  </div>
                  <div className="w-24">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openPreview(doc)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="预览">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDownload(doc)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="下载">
                        <Download className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(doc.id)} className="p-2 text-gray-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg transition-colors" title="删除">
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
                <div key={doc.id} className="p-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all hover:shadow-md group cursor-pointer" onClick={() => toggleSelect(doc.id)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      {getFileIcon(doc.fileType)}
                    </div>
                    {selectedDocs.has(doc.id) && <CheckSquare className="w-5 h-5 text-primary-600" />}
                  </div>
                  <div className="mb-2">
                    <h3 className="font-medium text-gray-900 truncate mb-1">{doc.title}</h3>
                    <div className="flex items-center gap-2 mb-2">{getStatusBadge(doc.status)}</div>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>{doc.fileType?.toUpperCase()}</span>
                      <span>{formatFileSize(doc.fileSize)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{doc.chunkCount} 个片段</span>
                      <span>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('zh-CN') : '-'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 pt-2 border-t border-gray-100 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); openPreview(doc) }} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="预览">
                      <Eye className="w-3.5 h-3.5" />预览
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDownload(doc) }} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="下载">
                      <Download className="w-3.5 h-3.5" />下载
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(doc.id) }} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-gray-500 hover:text-danger-500 hover:bg-danger-50 rounded-lg transition-colors" title="删除">
                      <Trash2 className="w-3.5 h-3.5" />删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>共 {filteredDocuments.length} 个文档</span>
          <div className="flex items-center gap-4"><span>已选择 {selectedDocs.size} 项</span></div>
        </div>
      </Card>

      <UploadModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        uploadDocument={(file) => uploadDocument(file, selectedKBId)}
        uploadDocuments={(files) => uploadDocuments(files, selectedKBId)}
        uploadFolder={(zipFile) => uploadFolder(zipFile, selectedKBId)}
        uploadProgress={uploadProgress}
        knowledgeBases={knowledgeBases}
        selectedKBId={selectedKBId}
        onKBChange={setSelectedKBId}
      />

      <Modal open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title="文档详情" size="lg">
        {previewDoc && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500">文档名称</label>
                <p className="text-sm text-gray-900 font-medium mt-1">{previewDoc.title}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">文件类型</label>
                <p className="text-sm text-gray-900 mt-1">{previewDoc.fileType?.toUpperCase()}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">文件大小</label>
                <p className="text-sm text-gray-900 mt-1">{formatFileSize(previewDoc.fileSize)}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">状态</label>
                <div className="mt-1">{getStatusBadge(previewDoc.status)}</div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">片段数</label>
                <p className="text-sm text-gray-900 mt-1">{previewDoc.chunkCount} 个</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">知识库ID</label>
                <p className="text-sm text-gray-900 mt-1 truncate">{previewDoc.knowledgeBaseId}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">上传者</label>
                <p className="text-sm text-gray-900 mt-1 truncate">{previewDoc.uploadedBy}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">创建时间</label>
                <p className="text-sm text-gray-900 mt-1">{previewDoc.createdAt ? new Date(previewDoc.createdAt).toLocaleString('zh-CN') : '-'}</p>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-500">文件路径</label>
                <p className="text-sm text-gray-900 mt-1 break-all">{previewDoc.filePath}</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setIsPreviewOpen(false)}>关闭</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

interface UploadModalProps {
  open: boolean
  onClose: () => void
  uploadDocument: (file: File) => Promise<void>
  uploadDocuments: (files: File[]) => Promise<BulkUploadResponse>
  uploadFolder: (zipFile: File) => Promise<BulkUploadResponse>
  uploadProgress: number
  knowledgeBases: { id: string; name: string; config?: string }[]
  selectedKBId: string
  onKBChange: (id: string) => void
}

type UploadMode = 'single' | 'batch' | 'folder'

const UploadModal: React.FC<UploadModalProps> = ({ open, onClose, uploadDocument, uploadDocuments, uploadFolder, uploadProgress, knowledgeBases, selectedKBId, onKBChange }) => {
  const [uploadMode, setUploadMode] = useState<UploadMode>('single')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedZipFile, setSelectedZipFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<BulkUploadResponse | null>(null)

  const selectedKB = knowledgeBases.find((kb) => kb.id === selectedKBId)
  const isCarKD = selectedKB?.config?.includes('"docType":"CAR_MD"')

  const acceptConfig = isCarKD
    ? { 'text/markdown': ['.md'], 'text/plain': ['.md', '.markdown'] }
    : {
        'application/pdf': ['.pdf'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
        'application/vnd.ms-powerpoint': ['.ppt'],
        'text/plain': ['.txt'],
      }

  const zipAccept = { 'application/zip': ['.zip'] }

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (uploadMode === 'batch') {
      setSelectedFiles((prev) => [...prev, ...acceptedFiles])
    } else if (uploadMode === 'folder') {
      if (acceptedFiles.length > 0) setSelectedZipFile(acceptedFiles[0])
    } else {
      if (acceptedFiles.length > 0) setSelectedFiles([acceptedFiles[0]])
    }
  }, [uploadMode])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: uploadMode === 'folder' ? zipAccept : acceptConfig,
    maxFiles: uploadMode === 'single' ? 1 : uploadMode === 'folder' ? 1 : 0,
    multiple: uploadMode === 'batch',
  })

  const handleUpload = async () => {
    setIsUploading(true)
    setResult(null)
    try {
      if (uploadMode === 'folder' && selectedZipFile) {
        const res = await uploadFolder(selectedZipFile)
        setResult(res)
        if (res.failCount === 0) {
          resetForm()
          onClose()
        }
      } else if (uploadMode === 'batch' && selectedFiles.length > 0) {
        const res = await uploadDocuments(selectedFiles)
        setResult(res)
        if (res.failCount === 0) {
          resetForm()
          onClose()
        }
      } else if (uploadMode === 'single' && selectedFiles.length > 0) {
        await uploadDocument(selectedFiles[0])
        resetForm()
        onClose()
      }
    } catch {
      alert('上传失败')
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setSelectedFiles([])
    setSelectedZipFile(null)
    setResult(null)
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const totalSize = selectedFiles.reduce((sum, f) => sum + f.size, 0) + (selectedZipFile?.size || 0)

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const isUploadDisabled = () => {
    if (uploadMode === 'folder') return !selectedZipFile || !selectedKBId
    return selectedFiles.length === 0 || !selectedKBId
  }

  return (
    <Modal open={open} onClose={handleClose} title="上传文档" size="lg">
      <div className="space-y-4">
        {/* 上传模式切换 */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          {([
            { mode: 'single' as const, label: '单文件上传', icon: <Upload className="w-4 h-4" /> },
            { mode: 'batch' as const, label: '批量上传', icon: <Files className="w-4 h-4" /> },
            { mode: 'folder' as const, label: '文件夹上传', icon: <FolderArchive className="w-4 h-4" /> },
          ]).map(({ mode, label, icon }) => (
            <button
              key={mode}
              onClick={() => { setUploadMode(mode); setSelectedFiles([]); setSelectedZipFile(null); setResult(null) }}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                uploadMode === mode
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* 知识库选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">目标知识库</label>
          <select value={selectedKBId} onChange={(e) => onKBChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
            {knowledgeBases.map((kb) => (
              <option key={kb.id} value={kb.id}>{kb.name}</option>
            ))}
          </select>
        </div>

        {/* CAR_MD 提示 */}
        {isCarKD && (
          <div className="flex items-center justify-between p-3 bg-warning-50 border border-warning-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-warning-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              此知识库仅支持 <strong>Markdown 格式</strong> 文档上传
            </div>
            <a
              href="/车系MD模板示例.md"
              download="车系MD模板示例.md"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-warning-300 rounded-lg text-xs font-medium text-warning-700 hover:bg-warning-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              下载模板
            </a>
          </div>
        )}

        {/* 拖拽上传区域 */}
        {selectedFiles.length === 0 && !selectedZipFile ? (
          <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}`}>
            <input {...getInputProps()} />
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {uploadMode === 'folder' ? (
                <FolderArchive className={`w-8 h-8 ${isDragActive ? 'text-primary-600' : 'text-gray-400'}`} />
              ) : uploadMode === 'batch' ? (
                <Files className={`w-8 h-8 ${isDragActive ? 'text-primary-600' : 'text-gray-400'}`} />
              ) : (
                <Upload className={`w-8 h-8 ${isDragActive ? 'text-primary-600' : 'text-gray-400'}`} />
              )}
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              {uploadMode === 'folder'
                ? (isDragActive ? '拖拽 ZIP 文件到此处' : '拖拽 ZIP 压缩包到此处，或点击选择')
                : uploadMode === 'batch'
                ? (isDragActive ? '拖拽文件到此处' : '拖拽文件到此处，或点击选择多个文件')
                : (isDragActive ? '拖拽文件到此处' : '拖拽文件到此处，或点击选择')}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {uploadMode === 'folder'
                ? '上传 ZIP 压缩包，自动解压并导入其中所有文档（支持嵌套目录）'
                : uploadMode === 'batch'
                ? '可同时选择多个文件批量上传，单个失败不影响其他文件'
                : isCarKD ? '仅支持 Markdown 格式（.md 文件）' : '支持 PDF、Word、PowerPoint、TXT 等格式'}
            </p>
            <Button variant="secondary" size="sm">
              {uploadMode === 'folder' ? '选择 ZIP 文件' : uploadMode === 'batch' ? '选择多个文件' : '选择文件'}
            </Button>
          </div>
        ) : (
          /* 已选文件列表 */
          <div className="space-y-3">
            {uploadMode === 'folder' && selectedZipFile && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <FolderArchive className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{selectedZipFile.name}</p>
                    <p className="text-sm text-gray-500">{(selectedZipFile.size / 1024 / 1024).toFixed(2)} MB · ZIP 压缩包</p>
                  </div>
                  <button onClick={() => setSelectedZipFile(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {uploadMode !== 'folder' && selectedFiles.length > 0 && (
              <>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>已选择 {selectedFiles.length} 个文件</span>
                  <span>共 {(totalSize / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                        <FileText className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button onClick={() => removeFile(idx)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {uploadMode === 'batch' && (
                  <div {...getRootProps()} className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center cursor-pointer hover:border-primary-400 hover:bg-gray-50 transition-all">
                    <input {...getInputProps()} />
                    <p className="text-sm text-gray-500">拖拽或点击添加更多文件</p>
                  </div>
                )}
              </>
            )}

            {/* 上传进度 */}
            {isUploading && uploadProgress > 0 && (
              <div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span className="font-medium">上传进度</span>
                  <span className="text-primary-600 font-medium">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 上传结果摘要 */}
        {result && result.failCount > 0 && (
          <div className="p-4 bg-warning-50 border border-warning-200 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-warning-600" />
              <p className="font-medium text-sm text-warning-800">
                上传完成：成功 {result.successCount} 个，失败 {result.failCount} 个
              </p>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {result.errors.map((err, idx) => (
                <p key={idx} className="text-xs text-warning-700 pl-6">
                  ❌ <strong>{err.fileName}</strong>：{err.reason}
                </p>
              ))}
            </div>
            {result.successList.length > 0 && (
              <div className="mt-2 space-y-1">
                {result.successList.map((doc) => (
                  <p key={doc.id} className="text-xs text-green-700 pl-6">
                    ✅ {doc.title}.{doc.fileType}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="secondary" onClick={handleClose}>取消</Button>
          <Button onClick={handleUpload} loading={isUploading} disabled={isUploadDisabled()}>
            {isUploading
              ? '上传中...'
              : uploadMode === 'folder'
              ? '上传 ZIP 并导入'
              : uploadMode === 'batch'
              ? `上传 ${selectedFiles.length} 个文件`
              : '开始上传'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
