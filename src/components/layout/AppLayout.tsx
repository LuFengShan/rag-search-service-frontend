import React from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useLocation } from 'react-router-dom'

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const location = useLocation()

  const pageMap: Record<string, string> = {
    '/': '智能问答',
    '/documents': '文档管理',
    '/knowledge': '知识库',
    '/analytics': '运营分析',
    '/admin/users': '用户管理',
    '/admin/roles': '权限配置',
    '/admin/settings': '系统设置'
  }

  const currentPage = pageMap[location.pathname] || ''

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} onCollapseChange={setSidebarCollapsed} />
      <Header currentPage={currentPage} />
      <div className={`min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <main className="pt-20 px-6 pb-6">
          {children}
        </main>
      </div>
    </div>
  )
}
