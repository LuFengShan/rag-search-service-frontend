#!/bin/bash

# 企业私有知识库问答系统 - 环境检查脚本
# 快速检查 Node.js 和 npm 版本

set -e

echo "=================================="
echo "  环境检查"
echo "=================================="
echo ""

# 检查 Node.js
echo "检查 Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    echo "请访问 https://nodejs.org/ 下载安装"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✓ Node.js: $NODE_VERSION"

# 检查 npm
echo ""
echo "检查 npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✓ npm: v$NPM_VERSION"

# 检查版本要求
echo ""
echo "检查版本要求..."

NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)

if [ "$NODE_MAJOR" -lt 18 ]; then
    echo "❌ Node.js 版本过低（需要 v18.0.0 或更高）"
    exit 1
fi

echo "✓ Node.js 版本符合要求"

# 检查依赖
echo ""
echo "检查项目依赖..."
cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
    echo "⚠️  依赖未安装，将在使用时自动安装"
else
    echo "✓ 依赖已安装"
fi

echo ""
echo "=================================="
echo "  ✅ 所有检查通过！"
echo "=================================="
echo ""
echo "快速命令："
echo "  启动开发服务器: ./deploy.sh --dev"
echo "  构建生产版本:   ./deploy.sh --build"
echo "  查看帮助:       ./deploy.sh --help"
echo ""
