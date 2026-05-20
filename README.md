# 企业私有知识库问答系统 - 前端

基于 React + TypeScript + Vite 构建的企业私有知识库问答系统前端项目。

## 📋 项目简介

本项目是企业私有知识库问答系统的前端应用，提供文档管理、智能问答、知识库管理等功能。

## 🚀 快速开始

### 环境要求

- Node.js >= v18.0.0
- npm >= v9.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问：http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
src/
├── components/          # 组件目录
│   ├── layout/         # 布局组件
│   └── ui/             # UI 组件
├── pages/              # 页面组件
├── stores/             # 状态管理
├── services/           # 服务层
├── hooks/              # 自定义 Hooks
├── lib/                # 工具函数
└── types/              # TypeScript 类型定义
```

## 🎯 功能模块

| 模块 | 功能 | 路径 |
|------|------|------|
| 智能问答 | 自然语言问答、文档溯源 | `/` |
| 文档管理 | 文档上传、管理、检索 | `/documents` |
| 知识库 | 知识库创建、配置 | `/knowledge` |
| 运营分析 | 数据分析、趋势图表 | `/analytics` |
| 用户管理 | 用户列表、权限管理 | `/admin/users` |
| 权限配置 | 角色权限配置 | `/admin/roles` |
| 系统设置 | 系统参数配置 | `/admin/settings` |

## 🛠️ 技术栈

- **框架**: React 18
- **语言**: TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS 3
- **状态管理**: Zustand
- **图标**: Lucide React
- **图表**: Recharts

## 📝 脚本命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产版本 |
| `npm run lint` | 运行 ESLint |

## 🔧 配置

### Vite 配置

文件：`vite.config.ts`

### Tailwind CSS 配置

文件：`tailwind.config.js`

### TypeScript 配置

文件：`tsconfig.json`

## 📦 部署

### 一键部署

```bash
cd deployment
chmod +x deploy.sh
./deploy.sh --prod
```

详细部署指南：[deployment/部署指南.md](deployment/部署指南.md)

## 🐳 Docker 部署

```bash
# 构建镜像
docker build -t rag-frontend .

# 运行容器
docker run -p 5173:5173 rag-frontend
```

## 📄 License

MIT

---

**版本**: v1.0.0
**更新时间**: 2024年
