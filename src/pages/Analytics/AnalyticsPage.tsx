import React, { useEffect, useState } from 'react'
import { TrendingUp, MessageSquare, Clock, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import * as analyticsApi from '../../services/analyticsApi'
import { AnalyticsOverview, TrendData } from '../../types'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export const AnalyticsPage: React.FC = () => {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, trendRes] = await Promise.all([
          analyticsApi.getOverview(),
          analyticsApi.getTrend(
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            new Date().toISOString().split('T')[0],
            'daily'
          )
        ])
        setOverview(overviewRes.data)
        setTrendData(trendRes.data.data || [])
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const data = overview

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">运营分析</h1>
          <p className="text-sm text-gray-600">监控知识库使用情况，持续优化用户体验</p>
        </div>
        <div className="flex items-center justify-center py-20 text-gray-500">加载中...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">运营分析</h1>
          <p className="text-sm text-gray-600">监控知识库使用情况，持续优化用户体验</p>
        </div>
        <div className="flex items-center justify-center py-20 text-gray-500">暂无数据</div>
      </div>
    )
  }

  const statsCards = [
    {
      title: '总提问数',
      value: data.totalQuestions.toLocaleString(),
      icon: MessageSquare,
      color: 'bg-gradient-to-br from-primary-500 to-primary-600',
      trend: null,
      trendUp: true
    },
    {
      title: '今日提问',
      value: (data.todayQuestions || 0).toLocaleString(),
      icon: TrendingUp,
      color: 'bg-gradient-to-br from-success-500 to-success-600',
      trend: null,
      trendUp: true
    },
    {
      title: '平均处理时间',
      value: `${data.avgResponseTime.toFixed(1)}s`,
      icon: Clock,
      color: 'bg-gradient-to-br from-warning-500 to-warning-600',
      trend: null,
      trendUp: false
    },
    {
      title: '回答成功率',
      value: `${Math.round(data.satisfactionRate * 100)}%`,
      icon: Star,
      color: 'bg-gradient-to-br from-danger-500 to-danger-600',
      trend: null,
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
                {stat.trend && (
                <Badge variant={stat.trendUp ? 'success' : 'danger'} className="flex items-center gap-1">
                  {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </Badge>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
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
              <h2 className="font-semibold text-gray-900">最近处理文档 TOP 5</h2>
              <p className="text-sm text-gray-500">按分块数量排序</p>
            </div>
          </div>
          <div className="space-y-3">
            {data.hotDocuments && data.hotDocuments.length > 0 && data.hotDocuments[0].count > 0 ? (
              data.hotDocuments.map((doc, index) => {
                const maxCount = data.hotDocuments[0].count || 1
                const pct = Math.min(Math.round((doc.count / maxCount) * 100), 100)
                return (
                <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate">{doc.title}</div>
                    <div className="text-xs text-gray-400">{doc.count} 个分块</div>
                  </div>
                  <div className="w-16 flex-shrink-0">
                    <div className="bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-primary-500 rounded-full h-1.5 transition-all"
                        style={{ width: `${Math.max(pct, 8)}%` }}
                      />
                    </div>
                  </div>
                </div>
                )
              })
            ) : (
              <div className="text-sm text-gray-400 py-12 text-center">上传文档并完成处理后将在此展示</div>
            )}
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
          {data.hotQuestions && data.hotQuestions.length > 0 ? (
            data.hotQuestions.map((item, index) => (
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
            ))
          ) : (
            <div className="text-sm text-gray-500 py-8 text-center">暂无数据</div>
          )}
        </div>
      </Card>
    </div>
  )
}
