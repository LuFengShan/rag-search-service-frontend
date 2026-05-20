import api from './api'
import { ApiResponse, AnalyticsOverview, TrendResponse } from '../types'

export const getOverview = () =>
  api.get<ApiResponse<AnalyticsOverview>>('/analytics/overview').then((res) => res.data)

export const getTrend = (startDate: string, endDate: string, type = 'daily') =>
  api
    .get<ApiResponse<TrendResponse>>('/analytics/trend', {
      params: { startDate, endDate, type },
    })
    .then((res) => res.data)
