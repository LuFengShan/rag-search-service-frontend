import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, LogIn, AlertCircle } from 'lucide-react'
import { useUserStore } from '../../stores/userStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isLoading } = useUserStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码')
      return
    }
    setError('')
    try {
      await login(username, password)
      navigate('/', { replace: true })
    } catch {
      setError('登录失败，请检查用户名和密码')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">企业知识库问答系统</h1>
          <p className="text-gray-500 mt-1">基于 RAG 技术的智能检索平台</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">用户登录</h2>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-danger-50 border border-danger-200 rounded-lg text-sm text-danger-600 mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                用户名
              </label>
              <Input
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                密码
              </label>
              <Input
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" loading={isLoading}>
              <LogIn className="w-4 h-4 mr-1.5" />
              登录
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          企业私有知识库 · 安全可靠
        </p>
      </div>
    </div>
  )
}
