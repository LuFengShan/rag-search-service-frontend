import { Document } from '../../types'

export const mockDocuments: Document[] = [
  {
    id: '1',
    title: '员工手册 2024',
    file_type: 'pdf',
    file_size: 2048576,
    status: 'indexed',
    chunks: 45,
    knowledge_base_id: '1',
    uploaded_by: '张三',
    created_at: '2024-01-15 10:30:00',
    updated_at: '2024-01-15 10:30:00'
  },
  {
    id: '2',
    title: '产品技术白皮书',
    file_type: 'docx',
    file_size: 1536000,
    status: 'indexed',
    chunks: 38,
    knowledge_base_id: '1',
    uploaded_by: '李四',
    created_at: '2024-01-20 14:20:00',
    updated_at: '2024-01-20 14:20:00'
  },
  {
    id: '3',
    title: '财务报销制度',
    file_type: 'pdf',
    file_size: 1024000,
    status: 'indexed',
    chunks: 28,
    knowledge_base_id: '2',
    uploaded_by: '王五',
    created_at: '2024-01-25 09:15:00',
    updated_at: '2024-01-25 09:15:00'
  },
  {
    id: '4',
    title: '项目管理流程指南',
    file_type: 'pptx',
    file_size: 3072000,
    status: 'processing',
    chunks: 0,
    knowledge_base_id: '1',
    uploaded_by: '赵六',
    created_at: '2024-02-01 16:45:00',
    updated_at: '2024-02-01 16:45:00'
  },
  {
    id: '5',
    title: '安全操作规程',
    file_type: 'pdf',
    file_size: 512000,
    status: 'indexed',
    chunks: 15,
    knowledge_base_id: '2',
    uploaded_by: '钱七',
    created_at: '2024-02-05 11:20:00',
    updated_at: '2024-02-05 11:20:00'
  }
]
