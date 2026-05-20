#!/bin/bash

set -e

# 企业私有知识库问答系统 - 一键部署脚本
# 适用于 Linux 和 macOS

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目路径
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT_DIR="$(dirname "${PROJECT_ROOT}")"

# 配置文件
CONFIG_FILE="${PROJECT_ROOT}/config/app.conf"

# 加载配置
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
else
    echo -e "${YELLOW}配置文件不存在，使用默认配置${NC}"
    APP_PORT=${APP_PORT:-5173}
    NODE_MIN_VERSION=${NODE_MIN_VERSION:-18.0.0}
fi

# 打印横幅
print_banner() {
    echo -e "${BLUE}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║     企业私有知识库问答系统 - 前端一键部署脚本 v1.0.0        ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# 打印信息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

# 打印警告
print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# 打印错误
print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 打印成功
print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# 检查操作系统
check_os() {
    print_info "检查操作系统..."

    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
        print_success "检测到 Linux 系统"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        print_success "检测到 macOS 系统"
    else
        print_error "不支持的操作系统: $OSTYPE"
        exit 1
    fi
}

# 检查 Node.js 版本
check_node_version() {
    print_info "检查 Node.js 版本..."

    if ! command -v node &> /dev/null; then
        print_error "Node.js 未安装，请先安装 Node.js"
        print_info "下载地址: https://nodejs.org/"
        exit 1
    fi

    NODE_CURRENT=$(node -v | sed 's/v//')
    NODE_MAJOR=$(echo $NODE_CURRENT | cut -d. -f1)
    NODE_MINOR=$(echo $NODE_CURRENT | cut -d. -f2)

    NODE_MIN_MAJOR=$(echo $NODE_MIN_VERSION | cut -d. -f1)
    NODE_MIN_MINOR=$(echo $NODE_MIN_VERSION | cut -d. -f2)

    print_info "当前 Node.js 版本: v${NODE_CURRENT}"
    print_info "最低要求版本: v${NODE_MIN_VERSION}"

    if [ "$NODE_MAJOR" -lt "$NODE_MIN_MAJOR" ] || ([ "$NODE_MAJOR" -eq "$NODE_MIN_MAJOR" ] && [ "$NODE_MINOR" -lt "$NODE_MIN_MINOR" ]); then
        print_error "Node.js 版本过低，请升级到 v${NODE_MIN_VERSION} 或更高版本"
        print_info "下载地址: https://nodejs.org/"
        exit 1
    fi

    print_success "Node.js 版本检查通过"
}

# 检查 npm 版本
check_npm_version() {
    print_info "检查 npm 版本..."

    if ! command -v npm &> /dev/null; then
        print_error "npm 未安装"
        exit 1
    fi

    NPM_CURRENT=$(npm -v)
    NPM_MIN_VERSION="9.0.0"

    print_info "当前 npm 版本: v${NPM_CURRENT}"
    print_info "最低要求版本: v${NPM_MIN_VERSION}"

    if [ "$(printf '%s\n' "$NPM_MIN_VERSION" "$NPM_CURRENT" | sort -V | head -n1)" != "$NPM_MIN_VERSION" ]; then
        print_error "npm 版本过低，请升级到 v${NPM_MIN_VERSION} 或更高版本"
        print_info "升级命令: npm install -g npm@latest"
        exit 1
    fi

    print_success "npm 版本检查通过"
}

# 检查依赖
check_dependencies() {
    print_info "检查工程依赖..."

    cd "$PROJECT_ROOT"

    if [ ! -f "package.json" ]; then
        print_error "package.json 文件不存在"
        exit 1
    fi

    if [ ! -d "node_modules" ]; then
        print_warn "node_modules 目录不存在，开始安装依赖..."
        install_dependencies
    else
        print_success "依赖已安装"
    fi
}

# 安装依赖
install_dependencies() {
    print_info "安装项目依赖..."

    cd "$PROJECT_ROOT"

    if ! npm install; then
        print_error "依赖安装失败"
        exit 1
    fi

    print_success "依赖安装完成"
}

# 清理构建
clean_build() {
    print_info "清理旧的构建文件..."

    cd "$PROJECT_ROOT"

    if [ -d "dist" ]; then
        rm -rf dist
        print_success "清理完成"
    fi
}

# 构建项目
build_project() {
    print_info "开始构建项目..."

    cd "$PROJECT_ROOT"

    print_info "执行 npm run build..."
    if ! npm run build; then
        print_error "项目构建失败"
        exit 1
    fi

    print_success "项目构建成功"
}

# 启动服务（开发模式）
start_dev_server() {
    print_info "启动开发服务器..."

    cd "$PROJECT_ROOT"

    print_info "执行 npm run dev..."
    print_info "服务将在 http://localhost:${APP_PORT} 启动"
    print_info "按 Ctrl+C 停止服务"

    npm run dev
}

# 启动服务（生产模式）
start_prod_server() {
    print_info "启动生产服务器..."

    cd "$PROJECT_ROOT"

    if [ ! -d "dist" ]; then
        print_error "生产构建文件不存在，请先执行构建"
        exit 1
    fi

    print_info "启动静态文件服务器..."
    print_info "服务将在 http://localhost:${APP_PORT} 启动"
    print_info "按 Ctrl+C 停止服务"

    # 使用 npx serve 或其他简单服务器
    npx serve -s dist -l $APP_PORT
}

# 停止服务
stop_server() {
    print_info "停止服务..."

    if [[ "$OS" == "macos" ]]; then
        # macOS
        if command -v lsof &> /dev/null; then
            PID=$(lsof -ti:$APP_PORT)
            if [ ! -z "$PID" ]; then
                kill $PID
                print_success "服务已停止 (PID: $PID)"
            else
                print_warn "端口 $APP_PORT 未被占用"
            fi
        else
            print_error "lsof 命令不可用，无法停止服务"
        fi
    else
        # Linux
        if command -v fuser &> /dev/null; then
            fuser -k $APP_PORT/tcp
            print_success "服务已停止"
        else
            print_error "fuser 命令不可用，无法停止服务"
        fi
    fi
}

# 检查端口占用
check_port() {
    print_info "检查端口 ${APP_PORT} 是否可用..."

    if [[ "$OS" == "macos" ]]; then
        if command -v lsof &> /dev/null; then
            if lsof -i:$APP_PORT &> /dev/null; then
                print_warn "端口 $APP_PORT 已被占用"
                read -p "是否停止占用该端口的服务? (y/n) " -n 1 -r
                echo
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    stop_server
                else
                    print_error "请更换端口或停止占用端口的服务"
                    exit 1
                fi
            else
                print_success "端口 $APP_PORT 可用"
            fi
        fi
    else
        if command -v ss &> /dev/null; then
            if ss -tuln | grep -q ":$APP_PORT "; then
                print_warn "端口 $APP_PORT 已被占用"
                read -p "是否停止占用该端口的服务? (y/n) " -n 1 -r
                echo
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    stop_server
                else
                    print_error "请更换端口或停止占用端口的服务"
                    exit 1
                fi
            else
                print_success "端口 $APP_PORT 可用"
            fi
        fi
    fi
}

# 显示帮助
show_help() {
    print_banner
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  --check         只进行依赖和版本检查"
    echo "  --build         只构建项目"
    echo "  --dev           启动开发服务器"
    echo "  --prod          启动生产服务器"
    echo "  --stop          停止运行的服务"
    echo "  --clean         清理构建文件"
    echo "  --help          显示帮助信息"
    echo "  --version       显示版本信息"
    echo ""
    echo "示例:"
    echo "  $0 --check       # 检查环境"
    echo "  $0 --build       # 构建项目"
    echo "  $0 --dev         # 启动开发服务器"
    echo "  $0 --prod        # 启动生产服务器"
    echo "  $0 --stop        # 停止服务"
    echo ""
}

# 显示版本
show_version() {
    echo "企业私有知识库问答系统 - 前端部署脚本 v1.0.0"
    echo ""
    echo "最低要求:"
    echo "  Node.js: v${NODE_MIN_VERSION}"
    echo "  npm: v9.0.0"
}

# 主函数
main() {
    case "${1:-}" in
        --check)
            print_banner
            check_os
            check_node_version
            check_npm_version
            check_dependencies
            print_success "所有检查通过！"
            ;;
        --build)
            print_banner
            check_os
            check_node_version
            check_npm_version
            check_dependencies
            clean_build
            build_project
            print_success "构建完成！"
            ;;
        --dev)
            print_banner
            check_os
            check_node_version
            check_npm_version
            check_dependencies
            check_port
            start_dev_server
            ;;
        --prod)
            print_banner
            check_os
            check_node_version
            check_npm_version
            check_dependencies
            clean_build
            build_project
            check_port
            start_prod_server
            ;;
        --stop)
            stop_server
            ;;
        --clean)
            clean_build
            ;;
        --help|-h)
            show_help
            ;;
        --version|-v)
            show_version
            ;;
        "")
            print_banner
            echo "请指定操作选项，查看帮助: $0 --help"
            echo ""
            echo "快速开始:"
            echo "  1. 检查环境:    $0 --check"
            echo "  2. 构建项目:    $0 --build"
            echo "  3. 启动开发:    $0 --dev"
            echo "  4. 启动生产:    $0 --prod"
            ;;
        *)
            print_error "未知选项: $1"
            echo "查看帮助: $0 --help"
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
