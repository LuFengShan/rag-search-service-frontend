import React from 'react'
import { Shield, Plus, Check, Users, Edit2, Eye } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'

export const RolesPage: React.FC = () => {
  const roles = [
    {
      id: 'admin',
      name: '管理员',
      description: '系统管理员，拥有所有权限',
      permissions: ['用户管理', '知识库管理', '文档管理', '系统设置', '运营分析'],
      userCount: 1
    },
    {
      id: 'maintainer',
      name: '知识库维护者',
      description: '负责知识库的日常维护和文档管理',
      permissions: ['文档上传', '文档编辑', '文档删除', '知识库配置'],
      userCount: 2
    },
    {
      id: 'user',
      name: '普通用户',
      description: '普通问答用户，只能提问和查看答案',
      permissions: ['提问问答', '查看文档', '收藏答案'],
      userCount: 5
    }
  ]

  const allPermissions = [
    '用户管理',
    '知识库管理',
    '文档管理',
    '文档上传',
    '文档编辑',
    '文档删除',
    '知识库配置',
    '系统设置',
    '运营分析',
    '提问问答',
    '查看文档',
    '收藏答案'
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">权限配置</h1>
          <p className="text-sm text-gray-600">管理角色权限，控制用户对系统功能的访问</p>
        </div>
        <Button className="shadow-sm">
          <Plus className="w-4 h-4 mr-1.5" />
          添加角色
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {roles.map((role) => (
          <Card key={role.id} className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{role.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    {role.userCount} 人
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{role.description}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-xs font-medium text-gray-600">权限列表：</p>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium"
                  >
                    <Check className="w-3 h-3" />
                    {permission}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100">
              <Button variant="secondary" size="sm" className="flex-1">
                <Edit2 className="w-3.5 h-3.5 mr-1" />
                编辑权限
              </Button>
              <Button variant="ghost" size="sm">
                <Eye className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">权限矩阵</h2>
            <p className="text-sm text-gray-500">查看所有角色和权限的对应关系</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">权限</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">管理员</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">知识库维护者</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">普通用户</th>
              </tr>
            </thead>
            <tbody>
              {allPermissions.map((permission) => (
                <tr key={permission} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-900 font-medium">{permission}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="success" className="w-6 h-6 flex items-center justify-center p-0 rounded-full">
                      <Check className="w-4 h-4" />
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {permission.includes('文档') || permission.includes('知识库') ? (
                      <Badge variant="success" className="w-6 h-6 flex items-center justify-center p-0 rounded-full">
                        <Check className="w-4 h-4" />
                      </Badge>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {permission === '提问问答' || permission === '查看文档' || permission === '收藏答案' ? (
                      <Badge variant="success" className="w-6 h-6 flex items-center justify-center p-0 rounded-full">
                        <Check className="w-4 h-4" />
                      </Badge>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
