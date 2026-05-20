import React from 'react'
import { BarChart3, TrendingUp, MessageSquare, Clock, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { mockAnalyticsOverview, mockTrendData } from '../../services/mock/analytics'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export const AnalyticsPage: React.FC = () => {
  const data = mockAnalyticsOverview
  const trendData = mockTrendData

  const statsCards = [
    {
      title: '总提问数',
      value: data.total_questions.toLocaleString(),
      icon: MessageSquare,
      color: 'bg-gradient-to-br from-primary-500 to-primary-600',
      trend: '+12.5%',
      trendUp: true
    },
    {
      title: '今日提问',
      value: data.today_questions,
      icon: TrendingUp,
      color: 'bg-gradient-to-br from-success-500 to-success-600',
      trend: '+5.2%',
      trendUp: true
    },
    {
      title: '平均响应时间',
      value: `${data.avg_response_time}s`,
      icon: Clock,
      color: 'bg-gradient-to-br from-warning-500 to-warning-600',
      trend: '-8.3%',
      trendUp: false
    },
    {
      title: '满意度评分',
      value: data.satisfaction_rate.toFixed(1),
      icon: Star,
      color: 'bg-gradient-to-br from-danger-500 to-danger-600',
      trend: '+0.2',
      trendUp: true
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">运营分析</h1>
        <p className="text-sm text-gray-600">监控知识库使用情况，持续优化用户体验</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <Badge variant={stat.trendUp ? 'success' : 'danger'} className="flex items-center gap-1">
                  {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </Badge>
              </div>
              <div className="text-2.5xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.title}</div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="h-full">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">问答趋势</h2>
              <p className="text-sm text-gray-500">近7天提问与回答数量</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="questions"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
                name="提问数"
              />
              <Line
                type="monotone"
                dataKey="answers"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', r: 4 }}
                name="回答数"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="h-full">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">热门文档 TOP 5</h2>
              <p className="text-sm text-gray-500">被检索次数最多的文档</p>
            </div>
          </div>
          <div className="space-y-3">
            {data.hot_documents.map((doc, index) => (
              <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm
                  ${index === 0 ? 'bg-warning-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-warning-700 text-white' :
                    'bg-gray-100 text-gray-600'}
                `}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">{doc.title}</div>
                  <div className="text-xs text-gray-500">{doc.count} 次检索</div>
                </div>
                <div className="w-20">
                  <div className="bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-primary-500 rounded-full h-1.5 transition-all"
                      style={{ width: `${(doc.count / data.hot_documents[0].count) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">热门问题 TOP 5</h2>
            <p className="text-sm text-gray-500">用户最常提问的问题</p>
          </div>
        </div>
        <div className="space-y-2">
          {data.hot_questions.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${index === 0 ? 'bg-primary-100 text-primary-600' :
                  index === 1 ? 'bg-success-100 text-success-600' :
                  index === 2 ? 'bg-warning-100 text-warning-600' :
                  'bg-gray-100 text-gray-600'}
              `}>
                {index + 1}
              </div>
              <div className="flex-1 font-medium text-gray-900 text-sm">
                {item.question}
              </div>
              <Badge variant="secondary" className="text-xs">
                {item.count} 次提问
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
