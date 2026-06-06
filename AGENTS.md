# 项目上下文

## 项目概述
AI Startup Scout - Chrome 浏览器扩展，用于搜索 AI 软件创业项目，提供市场洞察与投资分析。

### 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **集成服务**: coze-coding-dev-sdk (Web Search + LLM)
- **Chrome Extension**: Manifest V3

## 目录结构

```
├── public/
│   ├── extension/           # Chrome 扩展源文件
│   │   ├── manifest.json    # 扩展清单 (Manifest V3)
│   │   ├── popup.html       # 弹窗 UI
│   │   ├── popup.css        # 弹窗样式
│   │   ├── popup.js         # 弹窗逻辑
│   │   ├── background.js    # Service Worker
│   │   └── icons/           # 扩展图标 (16/32/48/128px)
│   └── ai-startup-scout.zip # 打包好的扩展 ZIP
├── scripts/                 # 构建与启动脚本
├── src/
│   ├── app/
│   │   ├── page.tsx         # Landing Page (首页)
│   │   ├── layout.tsx       # 根布局
│   │   ├── globals.css      # 全局样式
│   │   └── api/
│   │       ├── search/      # 搜索 API (web-search SDK)
│   │       ├── analyze/     # AI 分析 API (LLM SDK, SSE 流式)
│   │       ├── config/      # 配置 API (返回后端域名)
│   │       └── download/    # 扩展 ZIP 下载 API
│   ├── components/ui/       # Shadcn UI 组件库
│   ├── hooks/
│   └── lib/
├── next.config.ts
├── package.json
└── tsconfig.json
```

## API 接口

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/search` | POST | 搜索 AI 创业项目 (web-search SDK) |
| `/api/analyze` | POST | AI 深度分析 (LLM SDK, SSE 流式输出) |
| `/api/config` | GET | 获取后端配置 (API 域名等) |
| `/api/download` | GET | 下载 Chrome 扩展 ZIP 包 |

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。

## 开发规范

### 编码规范
- 默认按 TypeScript `strict` 心智写代码
- 禁止隐式 `any` 和 `as any`
- 函数参数、返回值、解构项、事件对象应有明确类型

### 版本号规范
- **小改**（修 bug、改文案、调样式）：patch +1（1.0.1 → 1.0.2）
- **大改**（新功能、架构调整）：minor +1（1.0.x → 1.1.0）
- **重大更新**（整体重构）：major +1（1.x → 2.0.0）
- 每次代码变更必须同步更新 manifest.json 中的 version 字段并重新打包 ZIP

### 版本备份规范
- 每次更新版本后，将当前 ZIP 备份到 `public/archive/ai-startup-scout-{version}.zip`
- 主下载包 `public/ai-startup-scout.zip` 始终是最新版本
- 备份命令：`cp public/ai-startup-scout.zip public/archive/ai-startup-scout-{version}.zip`
- git 提交历史作为代码级备份，可随时回溯任意版本

## Chrome 扩展开发
- 扩展使用 Manifest V3，文件位于 `public/extension/`
- 扩展通过后端 API 获取数据，不在扩展端暴露 API 密钥
- 扩展的 API_BASE 配置需与部署域名一致
- 修改扩展文件后需重新打包 ZIP：`cd public/extension && zip -r ../ai-startup-scout.zip .`

### Hydration 问题防范
- 严禁在 JSX 渲染逻辑中直接使用 typeof window、Date.now()、Math.random() 等动态数据
- 必须使用 'use client' 并配合 useEffect + useState

### next.config 配置规范
- 配置路径使用 path.resolve(__dirname, ...) 动态拼接

## UI 设计与组件规范
- 使用 shadcn/ui 组件、风格和规范
- 暗色主题为主（深空灰 #0F1117 基底）
- 强调色：电光靛蓝 #6366F1，高亮色：琥珀 #F59E0B

## 集成服务
- **Web Search**: 使用 `SearchClient` from `coze-coding-dev-sdk`
- **LLM**: 使用 `LLMClient` from `coze-coding-dev-sdk`，默认使用流式输出
- **Header 转发**: 必须使用 `HeaderUtils.extractForwardHeaders(request.headers)`
