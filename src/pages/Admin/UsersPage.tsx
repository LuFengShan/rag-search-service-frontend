import React, { useEffect, useState } from 'react'
import { Plus, Search, Mail, Edit2, Trash2, User, AlertCircle } from 'lucide-react'
import * as userApi from '../../services/userApi'
import { User as UserType } from '../../types'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const pageSize = 10

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'USER' })
  const [editFormData, setEditFormData] = useState({ username: '', email: '', role: 'USER' })
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchUsers = async (p = 0) => {
    setIsLoading(true)
    try {
      const res = await userApi.getUsers(p, pageSize)
      setUsers(res.data.list)
      setTotal(res.data.total)
    } catch {
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter((u) => {
    const s = searchTerm.toLowerCase()
    return u.username.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)
  })

  const handleCreate = async () => {
    if (!formData.username.trim() || !formData.password.trim()) {
      setFormError('用户名和密码为必填项')
      return
    }
    setIsSubmitting(true)
    setFormError('')
    try {
      await userApi.createUser(formData)
      setIsCreateOpen(false)
      setFormData({ username: '', email: '', password: '', role: 'USER' })
      fetchUsers(page)
    } catch {
      setFormError('创建失败，请检查用户名是否已存在')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEdit = (u: UserType) => {
    setEditingUser(u)
    setEditFormData({ username: u.username, email: u.email, role: u.role })
    setFormError('')
    setIsEditOpen(true)
  }

  const handleEdit = async () => {
    if (!editingUser) return
    setIsSubmitting(true)
    setFormError('')
    try {
      await userApi.updateUser(editingUser.id, {
        username: editFormData.username,
        email: editFormData.email,
        role: editFormData.role,
      })
      setIsEditOpen(false)
      setEditingUser(null)
      fetchUsers(page)
    } catch {
      setFormError('更新失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除该用户吗？')) return
    try {
      await userApi.deleteUser(id)
      fetchUsers(page)
    } catch {
      alert('删除失败')
    }
  }

  const getRoleBadge = (role: string) => {
    const variants: Record<string, any> = {
      ADMIN: { variant: 'danger', label: '管理员' },
      KNOWLEDGE_BASE_ADMIN: { variant: 'warning', label: '知识库维护者' },
      USER: { variant: 'default', label: '普通用户' }
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
        <Button
          onClick={() => {
            setFormData({ username: '', email: '', password: '', role: 'USER' })
            setFormError('')
            setIsCreateOpen(true)
          }}
          className="shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          添加用户
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <div className="relative">
            <Input
              placeholder="搜索用户..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-gray-500">加载中...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-gray-500">暂无用户数据</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">用户名</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">邮箱</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">角色</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">创建时间</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{u.username}</div>
                          <div className="text-xs text-gray-500">{u.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm">{u.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getRoleBadge(u.role)}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('zh-CN') : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(u)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-2 text-gray-400 hover:text-danger-500 hover:bg-danger-50 rounded-lg transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>共 {total} 个用户</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setPage(Math.max(0, page - 1)); fetchUsers(page - 1) }}
              disabled={page === 0}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              上一页
            </button>
            <span className="px-2">{page + 1}</span>
            <button
              onClick={() => { setPage(page + 1); fetchUsers(page + 1) }}
              disabled={(page + 1) * pageSize >= total}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </div>
      </Card>

      <Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="添加用户" size="md">
        <div className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2 p-3 bg-danger-50 border border-danger-200 rounded-lg text-sm text-danger-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {formError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              用户名 <span className="text-danger-500">*</span>
            </label>
            <Input
              placeholder="请输入用户名"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              邮箱
            </label>
            <Input
              placeholder="请输入邮箱"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              密码 <span className="text-danger-500">*</span>
            </label>
            <Input
              type="password"
              placeholder="请输入密码"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">角色</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="USER">普通用户</option>
              <option value="KNOWLEDGE_BASE_ADMIN">知识库维护者</option>
              <option value="ADMIN">管理员</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>取消</Button>
            <Button onClick={handleCreate} loading={isSubmitting}>确认添加</Button>
          </div>
        </div>
      </Modal>

      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)} title="编辑用户" size="md">
        <div className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2 p-3 bg-danger-50 border border-danger-200 rounded-lg text-sm text-danger-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {formError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">用户名</label>
            <Input
              placeholder="请输入用户名"
              value={editFormData.username}
              onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">邮箱</label>
            <Input
              placeholder="请输入邮箱"
              value={editFormData.email}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">角色</label>
            <select
              value={editFormData.role}
              onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="USER">普通用户</option>
              <option value="KNOWLEDGE_BASE_ADMIN">知识库维护者</option>
              <option value="ADMIN">管理员</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsEditOpen(false)}>取消</Button>
            <Button onClick={handleEdit} loading={isSubmitting}>保存修改</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
