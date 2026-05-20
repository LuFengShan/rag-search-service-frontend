import { Answer, Conversation, Source } from '../../types'

const mockSources: Source[] = [
  {
    document_id: '1',
    document_title: '员工手册 2024',
    chunk_content: '请假流程：员工请假需提前1天填写请假申请表，经部门经理审批后提交至人力资源部。请假类型包括事假、病假、年假等。',
    confidence: 0.95
  },
  {
    document_id: '2',
    document_title: '产品技术白皮书',
    chunk_content: '系统架构采用微服务设计，支持高并发、高可用、易扩展等特性。核心组件包括用户服务、订单服务、支付服务等。',
    confidence: 0.88
  }
]

export const mockQAHistory: Conversation[] = [
  {
    id: '1',
    question: '请假流程是什么？',
    answer: {
      id: '1',
      question_id: '1',
      answer: '根据员工手册规定，请假流程如下：\n\n1. **提前申请**：员工需提前1天填写请假申请表\n2. **部门审批**：部门经理进行审批\n3. **HR 备案**：提交至人力资源部备案\n\n请假类型包括事假、病假、年假等，不同假期有不同规定。详细条款请参考《员工手册》第5章。',
      sources: [mockSources[0]],
      confidence: 0.92,
      created_at: '2024-02-01 09:30:00'
    },
    isLoading: false,
    timestamp: '2024-02-01 09:30:00'
  },
  {
    id: '2',
    question: '系统架构是怎样的？',
    answer: {
      id: '2',
      question_id: '2',
      answer: '根据产品技术白皮书，系统架构采用微服务设计，具有以下特点：\n\n- **高并发**：支持万人同时在线\n- **高可用**：99.99% 的服务可用性\n- **易扩展**：支持水平扩展和垂直扩展\n\n核心组件包括用户服务、订单服务、支付服务等，通过 API 网关进行统一管理。',
      sources: [mockSources[1]],
      confidence: 0.88,
      created_at: '2024-02-01 14:20:00'
    },
    isLoading: false,
    timestamp: '2024-02-01 14:20:00'
  }
]

export const generateMockAnswer = (question: string): Answer => {
  return {
    id: Date.now().toString(),
    question_id: '',
    answer: `根据您的问题，我检索到了相关信息。\n\n这是一个基于 RAG（检索增强生成）技术的智能问答系统。该系统能够：\n\n1. **精准检索**：通过向量检索和关键词检索相结合，快速定位相关文档\n2. **智能生成**：基于检索结果生成准确、专业的答案\n3. **来源追溯**：每个答案都标注了参考来源，确保可溯源\n\n如果您需要更详细的信息，请继续提问或查阅相关文档。`,
    sources: mockSources,
    confidence: 0.89,
    created_at: new Date().toISOString()
  }
}
