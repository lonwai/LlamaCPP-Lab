# 🦙 LlamaCPP Lab

> 专为 `llama.cpp` 本地推理打造的轻量化对话工作台与实时性能监控面板。零数据库依赖，纯 JSON 文件驱动，让模型调优像看仪表盘一样直观。

## 🚀 项目简介

`LlamaCPP Lab` 是一个面向本地大模型部署者的开源 Web 工具，旨在解决 `llama.cpp` 原生服务缺乏可视化交互与性能反馈的痛点。项目基于 React 18 + TypeScript 构建，深度对接 `llama-server` 的 OpenAI 兼容 API，在提供类似 LM Studio 流畅多轮对话体验的同时，**实时解析并可视化底层推理指标**（首字延迟 TTFT、生成吞吐 Tokens/s、单字耗时、上下文衰减曲线等）。所有会话历史、参数配置与测试日志均以结构化 JSON 文件本地持久化，无需数据库，双击即可开箱运行。适用于模型量化对比、硬件瓶颈分析、采样参数调优及日常轻量对话归档。

## ✨ 核心特性

- 🗣️ **沉浸式对话体验**：支持多轮流式输出、Markdown 渲染、代码高亮、会话管理与参数热调
- 📊 **实时性能仪表盘**：动态展示生成速度、首字延迟 (TTFT)、Token 消耗统计与趋势图表
- 🗄️ **纯文件化数据管理**：对话记录、参数配置与基准测试日志自动落盘为 JSON，零数据库依赖
- 🔧 **调优辅助工具**：内置参数滑块配置、基准测试记录对比
- 🖥️ **轻量开箱即用**：React 前端 + 极简 Node 代理层，支持暗色/亮色主题，双击即可运行

## 🛠 技术栈

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| 前端框架 | React 18 + TypeScript + Vite | 组件化开发，类型安全，极速热更新 |
| UI / 样式 | TailwindCSS | 响应式布局，支持暗色/亮色主题 |
| 状态管理 | Zustand | 轻量无样板，管理会话流与指标状态 |
| 流式通信 | Fetch API + ReadableStream | 高效解析 SSE，逐字流式渲染不阻塞 |
| 本地存储 | Node.js 轻量代理 + `fs` 模块 | 结构化 JSON 落盘，零数据库依赖 |
| 对接服务 | `llama-server` | 兼容 OpenAI `/v1/chat/completions` 接口 |

## 📦 快速开始

### 前置要求

- 已安装 [Node.js](https://nodejs.org/) (v18+)
- 已下载 [llama.cpp](https://github.com/ggerganov/llama.cpp) 并配置好 `.gguf` 模型
- 已启动本地推理服务（需开启 `--cors`）

### 1. 启动 llama-server

```bash
llama-server \
  -m your-model.gguf \
  -t 4 -c 4096 --mlock -ngl 0 \
  --host 127.0.0.1 --port 8080 \
  --cors
```

### 2. 安装项目依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server && npm install && cd ..
```

### 3. 启动服务

```bash
# 终端 1: 启动后端代理服务器
npm run server

# 终端 2: 启动前端开发服务器
npm run dev
```

### 4. 访问界面

打开浏览器访问 `http://localhost:5173`，即可开始对话与性能监控。

## 📂 项目结构

```
llamacpp-lab/
├── public/              # 静态资源
├── src/
│   ├── components/      # UI 组件
│   │   ├── Chat/        # 对话相关组件
│   │   ├── Metrics/     # 性能指标组件
│   │   └── Layout/      # 布局组件
│   ├── hooks/           # 自定义 Hooks
│   ├── store/           # Zustand 状态管理
│   ├── types/           # TypeScript 类型定义
│   ├── api/             # API 请求封装
│   └── utils/           # 工具函数
├── server/              # Node.js 轻量代理
│   ├── index.js         # 服务器入口
│   └── package.json     # 后端依赖
├── data/                # 自动生成的本地数据目录
│   ├── conversations.json
│   ├── settings.json
│   └── benchmarks.json
├── package.json         # 前端依赖
├── tsconfig.json        # TypeScript 配置
├── vite.config.ts       # Vite 配置
├── tailwind.config.js   # TailwindCSS 配置
└── README.md
```

## 🗺️ 开发路线

- [x] Phase 1: 基础对话流 + 实时指标卡片 + JSON 存储
- [x] Phase 2: Recharts 趋势图 + 参数滑块 + 暗色主题切换
- [ ] Phase 3: 基准测试记录对比（性能数据落盘 + 历史对比）
- [ ] Phase 4: Tauri 桌面版打包

## 🤝 贡献指南

欢迎提交 Issue 与 PR！请遵循以下流程：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📜 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

---

💡 *提示：若你在部署或使用过程中遇到问题，请查阅 [Issues](https://github.com/lonwai/LlamaCPP-Lab/issues) 或提交新的反馈。*
