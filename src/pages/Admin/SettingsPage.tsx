import React, { useState } from 'react'
import { Settings as SettingsIcon, Save, RefreshCw, Check, AlertCircle } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

interface SettingsState {
  topK: number
  similarityThreshold: number
  chunkSize: number
  chunkOverlap: number
  enableRerank: boolean
  enableHybridSearch: boolean
  embeddingModel: string
  llmModel: string
  vectorDimension: number
  maxTokens: number
  maxConcurrentUsers: number
  cacheExpiry: number
  timeout: number
}

const DEFAULTS: SettingsState = {
  topK: 5,
  similarityThreshold: 0.7,
  chunkSize: 500,
  chunkOverlap: 50,
  enableRerank: true,
  enableHybridSearch: true,
  embeddingModel: 'BGE-large-zh (推荐)',
  llmModel: '通义千问 (Qwen)',
  vectorDimension: 1024,
  maxTokens: 1000,
  maxConcurrentUsers: 500,
  cacheExpiry: 3600,
  timeout: 30,
}

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({ ...DEFAULTS })
  const [savedSettings, setSavedSettings] = useState<SettingsState>({ ...DEFAULTS })
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  const update = (patch: Partial<SettingsState>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      setHasChanges(JSON.stringify(next) !== JSON.stringify(savedSettings))
      return next
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    await new Promise((r) => setTimeout(r, 800))
    setSavedSettings({ ...settings })
    setHasChanges(false)
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  const handleCancel = () => {
    setSettings({ ...savedSettings })
    setHasChanges(false)
  }

  const handleReset = () => {
    setSettings({ ...DEFAULTS })
    setHasChanges(true)
    setResetKey((k) => k + 1)
  }

  const inputClass =
    'w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm'

  const selectClass =
    'w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500'

  return (
    <div className="space-y-6 pb-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">系统设置</h1>
        <p className="text-sm text-gray-600">配置 RAG 参数、模型设置和系统参数，保存后即时生效</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="RAG 参数配置"
          subtitle="配置检索增强生成的参数"
          actions={
            <Button variant="secondary" size="sm" onClick={handleReset}>
              <RefreshCw className="w-4 h-4 mr-1" />
              重置默认
            </Button>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">检索数量 (Top-K)</label>
              <input
                type="number"
                value={settings.topK}
                onChange={(e) => update({ topK: Number(e.target.value) })}
                min={1}
                max={20}
                className={inputClass}
              />
              <p className="text-xs text-gray-500 mt-1">从向量数据库中检索的相关文档数量</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">相似度阈值</label>
              <input
                type="number"
                value={settings.similarityThreshold}
                onChange={(e) => update({ similarityThreshold: Number(e.target.value) })}
                step={0.1}
                min={0}
                max={1}
                className={inputClass}
              />
              <p className="text-xs text-gray-500 mt-1">低于此阈值的检索结果将被过滤</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分块大小</label>
              <input
                type="number"
                value={settings.chunkSize}
                onChange={(e) => update({ chunkSize: Number(e.target.value) })}
                min={100}
                max={2000}
                step={100}
                className={inputClass}
              />
              <p className="text-xs text-gray-500 mt-1">文档分块时的字符数</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分块重叠</label>
              <input
                type="number"
                value={settings.chunkOverlap}
                onChange={(e) => update({ chunkOverlap: Number(e.target.value) })}
                min={0}
                max={200}
                className={inputClass}
              />
              <p className="text-xs text-gray-500 mt-1">相邻分块之间的重叠字符数</p>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              <input
                type="checkbox"
                id="enableRerank"
                checked={settings.enableRerank}
                onChange={(e) => update({ enableRerank: e.target.checked })}
                className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
              />
              <label htmlFor="enableRerank" className="text-sm text-gray-700 cursor-pointer">启用结果重排序</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enableHybridSearch"
                checked={settings.enableHybridSearch}
                onChange={(e) => update({ enableHybridSearch: e.target.checked })}
                className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
              />
              <label htmlFor="enableHybridSearch" className="text-sm text-gray-700 cursor-pointer">启用混合检索（向量 + 关键词）</label>
            </div>
          </div>
        </Card>

        <Card title="模型配置" subtitle="选择和配置 embedding 和 LLM 模型">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Embedding 模型</label>
              <select
                value={settings.embeddingModel}
                onChange={(e) => update({ embeddingModel: e.target.value })}
                className={selectClass}
              >
                <option>BGE-large-zh (推荐)</option>
                <option>M3E-large</option>
                <option>Text2Vec-large</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">用于将文本转换为向量的模型</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LLM 大模型</label>
              <select
                value={settings.llmModel}
                onChange={(e) => update({ llmModel: e.target.value })}
                className={selectClass}
              >
                <option>通义千问 (Qwen)</option>
                <option>ChatGLM3</option>
                <option>Llama2</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">用于生成答案的大语言模型</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">向量维度</label>
              <select
                value={settings.vectorDimension}
                onChange={(e) => update({ vectorDimension: Number(e.target.value) })}
                className={selectClass}
              >
                <option value={1024}>1024 (推荐)</option>
                <option value={768}>768</option>
                <option value={1536}>1536</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">最大生成令牌数</label>
              <input
                type="number"
                value={settings.maxTokens}
                onChange={(e) => update({ maxTokens: Number(e.target.value) })}
                min={100}
                max={4000}
                className={inputClass}
              />
            </div>
          </div>
        </Card>
      </div>

      <Card title="系统参数" subtitle="配置系统级别的运行参数">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">最大并发用户数</label>
            <input
              type="number"
              value={settings.maxConcurrentUsers}
              onChange={(e) => update({ maxConcurrentUsers: Number(e.target.value) })}
              min={10}
              max={10000}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">缓存过期时间（秒）</label>
            <input
              type="number"
              value={settings.cacheExpiry}
              onChange={(e) => update({ cacheExpiry: Number(e.target.value) })}
              min={60}
              max={86400}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">超时时间（秒）</label>
            <input
              type="number"
              value={settings.timeout}
              onChange={(e) => update({ timeout: Number(e.target.value) })}
              min={5}
              max={120}
              className={inputClass}
            />
          </div>
        </div>
      </Card>

      {hasChanges && (
        <div className="flex items-center gap-2 p-3 bg-warning-50 border border-warning-200 rounded-lg text-sm text-warning-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          有未保存的更改，请点击"保存设置"使更改生效
        </div>
      )}

      <div className="flex justify-end gap-3">
        {saveSuccess && (
          <span className="flex items-center gap-1.5 text-sm text-success-600 mr-auto">
            <Check className="w-4 h-4" />
            设置已保存成功
          </span>
        )}
        <Button variant="secondary" onClick={handleCancel} disabled={!hasChanges}>
          取消
        </Button>
        <Button onClick={handleSave} loading={isSaving} disabled={!hasChanges}>
          <Save className="w-4 h-4 mr-1.5" />
          保存设置
        </Button>
      </div>
    </div>
  )
}
