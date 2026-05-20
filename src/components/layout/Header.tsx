import React, { useState } from 'react'
import { Bell, Upload, FileText, Database, Check, AlertCircle } from 'lucide-react'
import { useUserStore } from '../../stores/userStore'
import { useKnowledgeStore } from '../../stores/knowledgeStore'
import { useDocumentStore } from '../../stores/documentStore'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Modal } from '../ui/Modal'
import { useDropzone } from 'react-dropzone'

interface HeaderProps {
  currentPage?: string
}

export const Header: React.FC<HeaderProps> = ({ currentPage }) => {
  const { username, role } = useUserStore()
  const { knowledgeBases, fetchKnowledgeBases } = useKnowledgeStore()
  const { uploadDocument, uploadProgress } = useDocumentStore()

  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [selectedKBId, setSelectedKBId] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [justUploaded, setJustUploaded] = useState<{ name: string; kb: string } | null>(null)

  const pageTitleMap: Record<string, string> = {
    '智能问答': '智能问答',
    '文档问答': '文档问答',
    '文档管理': '文档管理',
    '知识库': '知识库',
    '运营分析': '运营分析',
    '用户管理': '用户管理',
    '权限配置': '权限配置',
    '系统设置': '系统设置'
  }

  const getRoleLabel = (r: string | null) => {
    if (r === 'ADMIN') return '管理员'
    if (r === 'KNOWLEDGE_BASE_ADMIN') return '知识库维护者'
    if (r === 'USER') return '普通用户'
    return '未登录'
  }

  const openQuickUpload = () => {
    fetchKnowledgeBases()
    setSelectedFile(null)
    setSelectedKBId('')
    setUploadSuccess(false)
    setUploadError('')
    setJustUploaded(null)
    setIsUploadOpen(true)
  }

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0])
      setUploadError('')
      setUploadSuccess(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  })

  const handleUpload = async () => {
    if (!selectedFile || !selectedKBId) return
    setIsUploading(true)
    setUploadError('')
    try {
      const kb = knowledgeBases.find((k) => k.id === selectedKBId)
      await uploadDocument(selectedFile, selectedKBId)
      setUploadSuccess(true)
      setJustUploaded({ name: selectedFile.name, kb: kb?.name || selectedKBId })
      setSelectedFile(null)
    } catch {
      setUploadError('上传失败，请稍后重试')
    } finally {
      setIsUploading(false)
    }
  }

  const closeUpload = () => {
    if (isUploading) return
    setIsUploadOpen(false)
  }

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-20 bg-white border-b border-gray-100 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            当前位置：<span className="font-medium text-gray-900">{pageTitleMap[currentPage || ''] || currentPage}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" className="hidden sm:flex" onClick={openQuickUpload}>
            <Upload className="w-4 h-4 mr-1.5" />
            快速上传
          </Button>

          <button className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-600">
                {username ? username.charAt(0).toUpperCase() : '?'}
              </span>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-gray-900">{username || '未登录'}</div>
              <div className="text-xs text-gray-500">{getRoleLabel(role)}</div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={isUploadOpen} onClose={closeUpload} title="快速上传文档" size="md">
        {uploadSuccess ? (
          <div className="space-y-4 text-center py-8">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-success-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">上传成功！</h3>
              <p className="text-sm text-gray-500">
                {justUploaded?.name} 已上传至「{justUploaded?.kb}」
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-4">
              <Button variant="secondary" onClick={closeUpload}>关闭</Button>
              <Button onClick={() => {
                setUploadSuccess(false)
                setSelectedFile(null)
                setSelectedKBId('')
              }}>
                <Upload className="w-4 h-4 mr-1.5" />继续上传
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {uploadError && (
              <div className="flex items-center gap-2 p-3 bg-danger-50 border border-danger-200 rounded-lg text-sm text-danger-600">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {uploadError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择目标知识库 <span className="text-danger-500">*</span>
              </label>
              <select
                value={selectedKBId}
                onChange={(e) => setSelectedKBId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">请选择知识库</option>
                {knowledgeBases.map((kb) => (
                  <option key={kb.id} value={kb.id}>{kb.name}</option>
                ))}
                {knowledgeBases.length === 0 && (
                  <option value="" disabled>暂无知识库，请先在知识库管理中创建</option>
                )}
              </select>
            </div>

            {!selectedFile ? (
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
                  ${isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                  }
                `}
              >
                <input {...getInputProps()} />
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className={`w-7 h-7 ${isDragActive ? 'text-primary-600' : 'text-gray-400'}`} />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {isDragActive ? '释放文件开始上传' : '拖拽文件到此处，或点击选择'}
                </p>
                <p className="text-xs text-gray-500">支持 PDF、Word、PowerPoint、TXT 格式</p>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>

                {isUploading && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span className="font-medium">上传中...</span>
                      <span className="text-primary-600 font-medium">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(uploadProgress, 2)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={closeUpload} disabled={isUploading}>取消</Button>
              <Button
                onClick={handleUpload}
                loading={isUploading}
                disabled={!selectedFile || !selectedKBId}
              >
                <Upload className="w-4 h-4 mr-1.5" />
                {isUploading ? '上传中...' : '开始上传'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </header>
  )
}
