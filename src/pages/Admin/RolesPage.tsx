import React, { useEffect, useState } from 'react'
import { Shield, Plus, Check, Users, Edit2, Eye, Trash2, X, AlertCircle, Save, Info } from 'lucide-react'
import * as userApi from '../../services/userApi'
import { User as UserType } from '../../types'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'

const ALL_PERMISSIONS = [
  { key: 'user_manage', label: '用户管理', desc: '创建、编辑、删除系统用户' },
  { key: 'kb_manage', label: '知识库管理', desc: '创建、更新、删除知识库' },
  { key: 'doc_manage', label: '文档管理', desc: '上传、查看、删除文档' },
  { key: 'doc_upload', label: '文档上传', desc: '上传新文档到知识库' },
  { key: 'doc_edit', label: '文档编辑', desc: '修改文档信息和内容' },
  { key: 'doc_delete', label: '文档删除', desc: '删除已有文档' },
  { key: 'kb_config', label: '知识库配置', desc: '配置检索参数与模型' },
  { key: 'system_config', label: '系统设置', desc: '修改全局系统参数' },
  { key: 'analytics', label: '运营分析', desc: '查看使用统计与趋势' },
  { key: 'qa_ask', label: '提问问答', desc: '提交问题获取AI回答' },
  { key: 'doc_view', label: '查看文档', desc: '浏览知识库中的文档' },
  { key: 'answer_bookmark', label: '收藏答案', desc: '收藏和标记答案' },
]

interface Role {
  id: string
  name: string
  backendRole: string
  description: string
  permissions: Set<string>
  userCount: number
}

export const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [allUsers, setAllUsers] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState<Role | null>(null)
  const [editPermissions, setEditPermissions] = useState<Set<string>>(new Set())
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [addForm, setAddForm] = useState({ name: '', description: '', backendRole: '' })
  const [addError, setAddError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const res = await userApi.getUsers(0, 100)
      const users = res.data.list
      setAllUsers(users)

      const adminCount = users.filter((u) => u.role === 'ADMIN').length
      const kbAdminCount = users.filter((u) => u.role === 'KNOWLEDGE_BASE_ADMIN').length
      const userCount = users.filter((u) => u.role === 'USER').length

      const defaultRoles: Role[] = [
        {
          id: 'ADMIN',
          name: '管理员',
          backendRole: 'ADMIN',
          description: '系统管理员，拥有所有权限',
          permissions: new Set(ALL_PERMISSIONS.map((p) => p.key)),
          userCount: adminCount,
        },
        {
          id: 'KNOWLEDGE_BASE_ADMIN',
          name: '知识库维护者',
          backendRole: 'KNOWLEDGE_BASE_ADMIN',
          description: '负责知识库的日常维护和文档管理',
          permissions: new Set(['doc_upload', 'doc_edit', 'doc_delete', 'kb_config', 'kb_manage', 'doc_manage', 'doc_view', 'qa_ask']),
          userCount: kbAdminCount,
        },
        {
          id: 'USER',
          name: '普通用户',
          backendRole: 'USER',
          description: '普通问答用户，只能提问和查看答案',
          permissions: new Set(['qa_ask', 'doc_view', 'answer_bookmark']),
          userCount: userCount,
        },
      ]
      setRoles(defaultRoles)
    } catch {
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleColor = (backendRole: string) => {
    const colors: Record<string, string> = {
      ADMIN: 'from-danger-100 to-danger-200',
      KNOWLEDGE_BASE_ADMIN: 'from-warning-100 to-warning-200',
      USER: 'from-primary-100 to-primary-200',
    }
    return colors[backendRole] || 'from-gray-100 to-gray-200'
  }

  const getRoleIconColor = (backendRole: string) => {
    const colors: Record<string, string> = {
      ADMIN: 'text-danger-600',
      KNOWLEDGE_BASE_ADMIN: 'text-warning-600',
      USER: 'text-primary-600',
    }
    return colors[backendRole] || 'text-gray-600'
  }

  const getRoleBadge = (backendRole: string) => {
    const map: Record<string, any> = {
      ADMIN: { variant: 'danger', label: '系统角色' },
      KNOWLEDGE_BASE_ADMIN: { variant: 'warning', label: '系统角色' },
      USER: { variant: 'primary', label: '系统角色' },
    }
    const config = map[backendRole] || { variant: 'default', label: '自定义角色' }
    return <Badge variant={config.variant} className="text-xs">{config.label}</Badge>
  }

  const openEdit = (role: Role) => {
    setCurrentRole(role)
    setEditPermissions(new Set(role.permissions))
    setSaveSuccess(false)
    setIsEditOpen(true)
  }

  const openView = (role: Role) => {
    setCurrentRole(role)
    setIsViewOpen(true)
  }

  const togglePermission = (key: string) => {
    const next = new Set(editPermissions)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    setEditPermissions(next)
    setSaveSuccess(false)
  }

  const handleSavePermissions = async () => {
    if (!currentRole) return
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setRoles((prev) =>
      prev.map((r) => (r.id === currentRole.id ? { ...r, permissions: editPermissions } : r))
    )
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => {
      setSaveSuccess(false)
      setIsEditOpen(false)
    }, 800)
  }

  const handleDeleteRole = (role: Role) => {
    if (['ADMIN', 'KNOWLEDGE_BASE_ADMIN', 'USER'].includes(role.backendRole)) {
      alert(`"${role.name}" 是系统内置角色，不可删除`)
      return
    }
    if (!confirm(`确定要删除角色"${role.name}"吗？该角色下的用户将被移至普通用户角色。`)) return
    setRoles((prev) => prev.filter((r) => r.id !== role.id))
  }

  const handleAddRole = () => {
    if (!addForm.name.trim()) {
      setAddError('请输入角色名称')
      return
    }
    if (!addForm.backendRole.trim()) {
      setAddError('请选择后端角色类型')
      return
    }
    setAddError('')
    const newRole: Role = {
      id: `custom_${Date.now()}`,
      name: addForm.name,
      backendRole: addForm.backendRole,
      description: addForm.description || '自定义角色',
      permissions: new Set(['qa_ask', 'doc_view']),
      userCount: 0,
    }
    setRoles((prev) => [...prev, newRole])
    setAddForm({ name: '', description: '', backendRole: '' })
    setIsAddOpen(false)
  }

  const getPermissionLabel = (key: string) => ALL_PERMISSIONS.find((p) => p.key === key)?.label || key

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">权限配置</h1>
          <p className="text-sm text-gray-600">管理角色权限，控制用户对系统功能的访问</p>
        </div>
        <Button
          onClick={() => {
            setAddForm({ name: '', description: '', backendRole: '' })
            setAddError('')
            setIsAddOpen(true)
          }}
          className="shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          添加角色
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-64 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-3 bg-gray-100 rounded w-1/2 mb-6" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-6 bg-gray-100 rounded w-1/3 inline-block mr-2 mb-2" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {roles.map((role) => (
            <Card key={role.id} className="h-full flex flex-col hover:shadow-md transition-shadow duration-200 group">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${getRoleColor(role.backendRole)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Shield className={`w-6 h-6 ${getRoleIconColor(role.backendRole)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{role.name}</h3>
                    {getRoleBadge(role.backendRole)}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{role.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                <Users className="w-3.5 h-3.5" />
                <span className="font-medium text-gray-700">{role.userCount}</span>
                <span>个用户拥有此角色</span>
              </div>

              <div className="space-y-2 mb-4 flex-1">
                <p className="text-xs font-medium text-gray-500">
                  权限（{role.permissions.size}/{ALL_PERMISSIONS.length}）：
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(role.permissions).slice(0, 6).map((key) => (
                    <span key={key} className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium">
                      <Check className="w-3 h-3" />
                      {getPermissionLabel(key)}
                    </span>
                  ))}
                  {role.permissions.size > 6 && (
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-medium">
                      +{role.permissions.size - 6} 项
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => openEdit(role)}>
                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                  编辑权限
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openView(role)}>
                  <Eye className="w-3.5 h-3.5" />
                </Button>
                {!['ADMIN', 'KNOWLEDGE_BASE_ADMIN', 'USER'].includes(role.backendRole) && (
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteRole(role)}
                    className="opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-danger-500" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">权限矩阵</h2>
            <p className="text-sm text-gray-500">所有角色与权限的对应关系一览</p>
          </div>
          <Badge variant="secondary" className="text-xs">{ALL_PERMISSIONS.length} 项权限</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 w-40">权限</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs text-gray-500 hidden md:table-cell">说明</th>
                {roles.map((role) => (
                  <th key={role.id} className="text-center py-3 px-4 font-semibold text-gray-700">
                    <div>{role.name}</div>
                    <div className="text-xs text-gray-400 font-normal">{role.userCount}人</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_PERMISSIONS.map((perm) => (
                <tr key={perm.key} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-900 font-medium text-xs">{perm.label}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs hidden md:table-cell">{perm.desc}</td>
                  {roles.map((role) => (
                    <td key={`${perm.key}-${role.id}`} className="py-3 px-4 text-center">
                      {role.permissions.has(perm.key) ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-success-100">
                          <Check className="w-3.5 h-3.5 text-success-600" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full">
                          <X className="w-3.5 h-3.5 text-gray-300" />
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-success-100 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-success-600" />
            </span>
            已授权
          </span>
          <span className="flex items-center gap-1.5">
            <X className="w-3 h-3 text-gray-300" />
            未授权
          </span>
        </div>
      </Card>

      <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)} title={`编辑权限 - ${currentRole?.name || ''}`} size="lg">
        <div className="space-y-4">
          <div className="flex items-start gap-2 p-3 bg-primary-50 border border-primary-200 rounded-lg text-sm text-primary-700">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-0.5">权限编辑说明</p>
              <p className="text-primary-600">勾选或取消权限项后点击保存即可生效。系统内置角色的核心权限不可取消。</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
            {ALL_PERMISSIONS.map((perm) => {
              const isSystemRole = currentRole && ['ADMIN', 'KNOWLEDGE_BASE_ADMIN', 'USER'].includes(currentRole.backendRole)
              const isCorePermission =
                currentRole?.backendRole === 'ADMIN' ||
                (currentRole?.backendRole === 'KNOWLEDGE_BASE_ADMIN' &&
                  ['doc_upload', 'doc_edit', 'doc_delete', 'kb_config', 'kb_manage', 'doc_manage'].includes(perm.key)) ||
                (currentRole?.backendRole === 'USER' && ['qa_ask', 'doc_view'].includes(perm.key))

              return (
                <label
                  key={perm.key}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    editPermissions.has(perm.key)
                      ? 'bg-primary-50 border-primary-300 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  } ${isCorePermission && isSystemRole ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={editPermissions.has(perm.key)}
                    onChange={() => !isCorePermission && togglePermission(perm.key)}
                    disabled={isCorePermission}
                    className="mt-0.5 w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900 block">{perm.label}</span>
                    <span className="text-xs text-gray-400">{perm.desc}</span>
                    {isCorePermission && (
                      <span className="text-xs text-warning-600 font-medium">（核心权限，不可取消）</span>
                    )}
                  </div>
                </label>
              )
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              已选择 <span className="font-semibold text-primary-600">{editPermissions.size}</span>/{ALL_PERMISSIONS.length} 项权限
            </div>

            <div className="flex items-center gap-3">
              {saveSuccess && (
                <span className="text-sm text-success-600 flex items-center gap-1">
                  <Check className="w-4 h-4" /> 已保存
                </span>
              )}
              <Button variant="secondary" onClick={() => setIsEditOpen(false)}>取消</Button>
              <Button onClick={handleSavePermissions} loading={isSaving}>
                <Save className="w-4 h-4 mr-1.5" />保存
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={isViewOpen} onClose={() => setIsViewOpen(false)} title={`角色详情 - ${currentRole?.name || ''}`} size="lg">
        {currentRole && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className={`w-16 h-16 bg-gradient-to-br ${getRoleColor(currentRole.backendRole)} rounded-2xl flex items-center justify-center shadow-sm`}>
                <Shield className={`w-8 h-8 ${getRoleIconColor(currentRole.backendRole)}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{currentRole.name}</h3>
                <p className="text-sm text-gray-500">{currentRole.description}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  {getRoleBadge(currentRole.backendRole)}
                  <Badge variant="secondary" className="text-xs">
                    <Users className="w-3 h-3 mr-1" />{currentRole.userCount} 个用户
                  </Badge>
                  <Badge variant="primary" className="text-xs">
                    {currentRole.permissions.size} 项权限
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">拥有以下权限：</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {ALL_PERMISSIONS.map((perm) => (
                  <div
                    key={perm.key}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${
                      currentRole.permissions.has(perm.key)
                        ? 'bg-success-50 border-success-200'
                        : 'bg-gray-50 border-gray-100 opacity-50'
                    }`}
                  >
                    {currentRole.permissions.has(perm.key) ? (
                      <span className="w-6 h-6 rounded-full bg-success-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-success-600" />
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <X className="w-3.5 h-3.5 text-gray-400" />
                      </span>
                    )}
                    <div>
                      <span className="text-sm font-medium text-gray-900 block">{perm.label}</span>
                      <span className="text-xs text-gray-400">{perm.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button variant="secondary" onClick={() => { setIsViewOpen(false); openEdit(currentRole) }}>
                <Edit2 className="w-4 h-4 mr-1.5" />编辑此角色权限
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="添加角色" size="md">
        <div className="space-y-4">
          {addError && (
            <div className="flex items-center gap-2 p-3 bg-danger-50 border border-danger-200 rounded-lg text-sm text-danger-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {addError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              角色名称 <span className="text-danger-500">*</span>
            </label>
            <Input
              placeholder="例如：数据分析师、部门主管"
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">描述</label>
            <textarea
              placeholder="描述该角色的职责和用途"
              value={addForm.description}
              onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
              rows={2}
              className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              后端角色类型 <span className="text-danger-500">*</span>
            </label>
            <select
              value={addForm.backendRole}
              onChange={(e) => setAddForm({ ...addForm, backendRole: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">请选择后端角色</option>
              <option value="ADMIN">管理员 (ADMIN)</option>
              <option value="KNOWLEDGE_BASE_ADMIN">知识库维护者 (KNOWLEDGE_BASE_ADMIN)</option>
              <option value="USER">普通用户 (USER)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">新角色会继承所选后端角色的基础权限，后续可自定义调整</p>
          </div>

          <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-primary-700">
                <p>创建后默认拥有"提问问答"和"查看文档"权限，您可以在角色卡片中点击"编辑权限"进行自定义调整。</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setIsAddOpen(false)}>取消</Button>
            <Button onClick={handleAddRole} disabled={!addForm.name.trim() || !addForm.backendRole.trim()}>
              <Plus className="w-4 h-4 mr-1" />添加角色
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
