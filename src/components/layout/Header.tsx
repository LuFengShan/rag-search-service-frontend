import React from 'react'
import { Bell, Upload, Settings } from 'lucide-react'
import { useUserStore } from '../../stores/userStore'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'

interface HeaderProps {
  currentPage?: string
}

export const Header: React.FC<HeaderProps> = ({ currentPage }) => {
  const { user } = useUserStore()

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

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-20 bg-white border-b border-gray-100 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            当前位置：<span className="font-medium text-gray-900">{pageTitleMap[currentPage || ''] || currentPage}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" className="hidden sm:flex">
            <Upload className="w-4 h-4 mr-1.5" />
            快速上传
          </Button>

          <button className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <Avatar src={user?.avatar} name={user?.username} size="sm" />
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-gray-900">{user?.username}</div>
              <div className="text-xs text-gray-500">{user?.role === 'admin' ? '管理员' : user?.role === 'maintainer' ? '知识库维护者' : '普通用户'}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
