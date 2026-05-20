#!/bin/bash

# 企业私有知识库问答系统 - 快速启动脚本
# 一键完成环境检查和开发服务器启动

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=================================="
echo "  企业私有知识库 - 快速启动"
echo "=================================="
echo ""

# 进入部署目录
cd "$SCRIPT_DIR"

# 执行环境检查
echo "步骤 1/3: 检查环境..."
./deploy.sh --check

echo ""
echo "步骤 2/3: 环境检查完成 ✓"
echo ""

# 启动开发服务器
echo "步骤 3/3: 启动开发服务器..."
echo ""
./deploy.sh --dev
