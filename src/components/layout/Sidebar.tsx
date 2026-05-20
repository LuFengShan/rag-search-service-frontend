import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  FileText,
  Database,
  BarChart3,
  Users,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react'
import { useUserStore } from '../../stores/userStore'

interface SidebarProps {
  collapsed?: boolean
  onCollapseChange?: (collapsed: boolean) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed: externalCollapsed,
  onCollapseChange
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()
  const { role, isAuthenticated, logout } = useUserStore()

  const isCollapsed = externalCollapsed ?? internalCollapsed

  const handleCollapse = () => {
    if (onCollapseChange) {
      onCollapseChange(!isCollapsed)
    } else {
      setInternalCollapsed(!internalCollapsed)
    }
  }

  const menuItems = [
    { path: '/', icon: Home, label: '智能问答', roles: ['ADMIN', 'KNOWLEDGE_BASE_ADMIN', 'USER'] },
    { path: '/documents', icon: FileText, label: '文档管理', roles: ['ADMIN', 'KNOWLEDGE_BASE_ADMIN'] },
    { path: '/knowledge', icon: Database, label: '知识库', roles: ['ADMIN', 'KNOWLEDGE_BASE_ADMIN'] },
    { path: '/analytics', icon: BarChart3, label: '运营分析', roles: ['ADMIN'] },
    { path: '/admin/users', icon: Users, label: '用户管理', roles: ['ADMIN'] },
    { path: '/admin/roles', icon: Shield, label: '权限配置', roles: ['ADMIN'] },
    { path: '/admin/settings', icon: Settings, label: '系统设置', roles: ['ADMIN'] }
  ]

  const filteredMenuItems = menuItems.filter(
    (item) => role && item.roles.includes(role)
  )

  const NavContent = () => (
    <>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-gray-900">知识库问答</h1>
              <p className="text-xs text-gray-500">智能检索系统</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                ${isActive
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {isAuthenticated && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 w-full
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>退出登录</span>}
          </button>
        </div>
      )}
    </>
  )

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <NavContent />
          </div>
        </div>
      )}

      <aside
        className={`
          hidden lg:flex fixed left-0 top-0 h-screen flex-col bg-white border-r border-gray-200 z-30
          transition-all duration-300
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        <NavContent />

        <button
          onClick={handleCollapse}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all hover:scale-110 z-10"
        >
          <ChevronLeft
            className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>
      </aside>
    </>
  )
}
