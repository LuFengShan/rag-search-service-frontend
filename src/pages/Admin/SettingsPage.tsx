import React from 'react'
import { Settings as SettingsIcon, Database, Brain, Save, RefreshCw } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">系统设置</h1>
        <p className="text-gray-600">配置 RAG 参数、模型设置和系统参数</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="RAG 参数配置"
          subtitle="配置检索增强生成的参数"
          actions={
            <Button variant="secondary" size="sm">
              <RefreshCw className="w-4 h-4 mr-1" />
              重置
            </Button>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                检索数量 (Top-K)
              </label>
              <Input type="number" defaultValue={5} min={1} max={20} />
              <p className="text-xs text-gray-500 mt-1">从向量数据库中检索的相关文档数量</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                相似度阈值
              </label>
              <Input type="number" defaultValue={0.7} step={0.1} min={0} max={1} />
              <p className="text-xs text-gray-500 mt-1">低于此阈值的检索结果将被过滤</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                分块大小
              </label>
              <Input type="number" defaultValue={500} min={100} max={2000} step={100} />
              <p className="text-xs text-gray-500 mt-1">文档分块时的字符数</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                分块重叠
              </label>
              <Input type="number" defaultValue={50} min={0} max={200} />
              <p className="text-xs text-gray-500 mt-1">相邻分块之间的重叠字符数</p>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              <input type="checkbox" id="enableRerank" className="rounded text-primary-600" defaultChecked />
              <label htmlFor="enableRerank" className="text-sm text-gray-700">
                启用结果重排序
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="enableHybridSearch" className="rounded text-primary-600" defaultChecked />
              <label htmlFor="enableHybridSearch" className="text-sm text-gray-700">
                启用混合检索（向量 + 关键词）
              </label>
            </div>
          </div>
        </Card>

        <Card
          title="模型配置"
          subtitle="选择和配置 embedding 和 LLM 模型"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Embedding 模型
              </label>
              <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>BGE-large-zh (推荐)</option>
                <option>M3E-large</option>
                <option>Text2Vec-large</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">用于将文本转换为向量的模型</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LLM 大模型
              </label>
              <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>通义千问 (Qwen)</option>
                <option>ChatGLM3</option>
                <option>Llama2</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">用于生成答案的大语言模型</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                向量维度
              </label>
              <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>1024 (推荐)</option>
                <option>768</option>
                <option>1536</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                最大生成令牌数
              </label>
              <Input type="number" defaultValue={1000} min={100} max={4000} />
            </div>
          </div>
        </Card>
      </div>

      <Card
        title="系统参数"
        subtitle="配置系统级别的参数"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              最大并发用户数
            </label>
            <Input type="number" defaultValue={500} min={10} max={1000} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              缓存过期时间（秒）
            </label>
            <Input type="number" defaultValue={3600} min={60} max={86400} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              超时时间（秒）
            </label>
            <Input type="number" defaultValue={30} min={5} max={120} />
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="secondary">
          取消
        </Button>
        <Button>
          <Save className="w-5 h-5 mr-2" />
          保存设置
        </Button>
      </div>
    </div>
  )
}
