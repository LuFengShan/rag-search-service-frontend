import React from 'react'
import { Plus, Search, MoreVertical, Mail, Edit2, Trash2, User } from 'lucide-react'
import { mockUsers } from '../../services/mock/users'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Avatar } from '../../components/ui/Avatar'

export const UsersPage: React.FC = () => {
  const users = mockUsers

  const getRoleBadge = (role: string) => {
    const variants: Record<string, any> = {
      admin: { variant: 'danger', label: '管理员' },
      maintainer: { variant: 'warning', label: '知识库维护者' },
      user: { variant: 'default', label: '普通用户' }
    }
    const config = variants[role] || { variant: 'default', label: role }
    return <Badge variant={config.variant} className="text-xs">{config.label}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">用户管理</h1>
          <p className="text-sm text-gray-600">管理系统用户，分配角色和权限</p>
        </div>
        <Button className="shadow-sm">
          <Plus className="w-4 h-4 mr-1.5" />
          添加用户
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <div className="relative">
            <Input
              placeholder="搜索用户..."
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">用户</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">邮箱</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">角色</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">创建时间</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.avatar} name={user.username} />
                      <div>
                        <div className="font-medium text-gray-900">{user.username}</div>
                        <div className="text-xs text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {user.created_at.split(' ')[0]}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="编辑">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg transition-colors" title="删除">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>共 {users.length} 个用户</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">上一页</button>
            <span className="px-2">1</span>
            <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">下一页</button>
          </div>
        </div>
      </Card>
    </div>
  )
}
