import { KnowledgeBase } from '../../types'

export const mockKnowledgeBases: KnowledgeBase[] = [
  {
    id: '1',
    name: '公司通用知识库',
    description: '包含公司制度、流程、技术文档等通用知识',
    embedding_model: 'BGE-large-zh',
    document_count: 45,
    status: 'active',
    created_at: '2024-01-10 08:00:00',
    updated_at: '2024-02-10 15:30:00'
  },
  {
    id: '2',
    name: '财务制度知识库',
    description: '财务报销、预算、成本控制相关制度',
    embedding_model: 'BGE-large-zh',
    document_count: 23,
    status: 'active',
    created_at: '2024-01-15 09:00:00',
    updated_at: '2024-02-08 14:20:00'
  },
  {
    id: '3',
    name: 'HR 政策知识库',
    description: '人力资源政策、绩效考核、培训制度',
    embedding_model: 'BGE-large-zh',
    document_count: 18,
    status: 'active',
    created_at: '2024-01-20 10:00:00',
    updated_at: '2024-02-05 16:45:00'
  },
  {
    id: '4',
    name: '技术文档知识库',
    description: '产品手册、技术方案、API 文档',
    embedding_model: 'BGE-large-zh',
    document_count: 32,
    status: 'inactive',
    created_at: '2024-01-25 11:00:00',
    updated_at: '2024-02-01 13:15:00'
  }
]
