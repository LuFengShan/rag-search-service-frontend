import { AnalyticsOverview, TrendData } from '../../types'

export const mockAnalyticsOverview: AnalyticsOverview = {
  total_questions: 1580,
  avg_response_time: 2.3,
  satisfaction_rate: 4.5,
  today_questions: 45,
  hot_documents: [
    { id: '1', title: '员工手册 2024', count: 234 },
    { id: '2', title: '产品技术白皮书', count: 189 },
    { id: '3', title: '财务报销制度', count: 156 },
    { id: '4', title: '项目管理流程指南', count: 123 },
    { id: '5', title: '安全操作规程', count: 98 }
  ],
  hot_questions: [
    { question: '请假流程是什么？', count: 56 },
    { question: '如何报销差旅费？', count: 43 },
    { question: '年假有多少天？', count: 38 },
    { question: '系统架构是怎样的？', count: 32 },
    { question: '如何申请设备采购？', count: 28 }
  ]
}

export const mockTrendData: TrendData[] = [
  { date: '2024-02-01', questions: 120, answers: 118 },
  { date: '2024-02-02', questions: 135, answers: 133 },
  { date: '2024-02-03', questions: 98, answers: 96 },
  { date: '2024-02-04', questions: 142, answers: 140 },
  { date: '2024-02-05', questions: 156, answers: 154 },
  { date: '2024-02-06', questions: 168, answers: 165 },
  { date: '2024-02-07', questions: 145, answers: 143 }
]
