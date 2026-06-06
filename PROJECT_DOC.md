# AI Startup Scout 项目文档

> 版本：1.1.1 | 最后更新：2025-06-06

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术架构](#2-技术架构)
3. [目录结构](#3-目录结构)
4. [后端 API 详解](#4-后端-api-详解)
   - 4.1 [搜索接口 POST /api/search](#41-搜索接口-post-apisearch)
   - 4.2 [分析接口 POST /api/analyze](#42-分析接口-post-apianalyze)
   - 4.3 [配置接口 GET /api/config](#43-配置接口-get-apiconfig)
   - 4.4 [下载接口 GET /api/download](#44-下载接口-get-apidownload)
   - 4.5 [健康检查 GET /api/health](#45-健康检查-get-apihealth)
5. [Chrome 扩展详解](#5-chrome-扩展详解)
   - 5.1 [manifest.json — 扩展清单](#51-manifestjson--扩展清单)
   - 5.2 [popup.html — 弹窗 UI](#52-popuphtml--弹窗-ui)
   - 5.3 [popup.css — 弹窗样式](#53-popupcss--弹窗样式)
   - 5.4 [popup.js — 弹窗交互逻辑](#54-popupjs--弹窗交互逻辑)
   - 5.5 [i18n.js — 国际化系统](#55-i18njs--国际化系统)
   - 5.6 [background.js — Service Worker](#56-backgroundjs--service-worker)
6. [前端页面详解](#6-前端页面详解)
   - 6.1 [Landing Page — 首页](#61-landing-page--首页)
   - 6.2 [Privacy Page — 隐私政策](#62-privacy-page--隐私政策)
7. [数据流图](#7-数据流图)
8. [国际化机制](#8-国际化机制)
9. [版本管理规范](#9-版本管理规范)
10. [部署与运维](#10-部署与运维)
11. [已知限制与待办](#11-已知限制与待办)

---

## 1. 项目概述

**AI Startup Scout** 是一款 Chrome 浏览器扩展，帮助用户搜索 AI 软件创业项目，并提供市场洞察与投资分析。用户在弹窗中输入关键词即可获取最新的 AI 创业项目信息，还可一键启动 AI 深度分析，获得投资级别的洞察报告。

### 核心功能

| 功能 | 说明 |
|------|------|
| 智能搜索 | 输入关键词，自动搜索 AI 创业项目，支持按融资/产品/开源/模型分类过滤 |
| AI 深度分析 | 基于搜索结果，LLM 流式生成市场洞察、重点推荐项目、投资建议 |
| 一键收藏 | 将感兴趣的项目保存到本地收藏夹（chrome.storage） |
| 中英双语 | 自动检测浏览器语言，搜索结果和 AI 分析均按语言本地化 |
| 服务保活 | Service Worker 每 4 分钟 ping 后端，防止沙箱休眠 |

### 技术栈

| 层级 | 技术 |
|------|------|
| 后端框架 | Next.js 16 (App Router) |
| 前端核心 | React 19 |
| 语言 | TypeScript 5 |
| UI 组件 | shadcn/ui (Radix UI) |
| 样式 | Tailwind CSS 4 |
| Web 搜索 | coze-coding-dev-sdk → SearchClient |
| 大语言模型 | coze-coding-dev-sdk → LLMClient (豆包 Seed) |
| 扩展标准 | Chrome Extension Manifest V3 |

---

## 2. 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                   Chrome Extension                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │popup.html │  │popup.js  │  │i18n.js   │              │
│  │popup.css  │  │          │  │          │              │
│  └─────┬─────┘  └────┬─────┘  └──────────┘              │
│        │              │                                   │
│  ┌─────┴──────────────┴──────┐                           │
│  │    chrome.storage.local    │  ← 收藏数据持久化         │
│  └───────────────────────────┘                           │
│  ┌───────────────────────────┐                           │
│  │    background.js (SW)     │  ← 保活 ping              │
│  └─────────────┬─────────────┘                           │
└────────────────┼────────────────────────────────────────┘
                 │ fetch /api/*
                 ▼
┌─────────────────────────────────────────────────────────┐
│               Next.js Backend (Port 5000)                │
│                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │ /api/search │  │/api/analyze│  │ /api/health │         │
│  │ SearchClient│  │ LLMClient  │  │  简单 ping  │         │
│  └─────┬──────┘  └─────┬──────┘  └────────────┘         │
│        │               │                                  │
│        ▼               ▼                                  │
│  ┌───────────────────────────────┐                       │
│  │  coze-coding-dev-sdk          │                       │
│  │  (SearchClient / LLMClient)   │                       │
│  │  环境变量自动注入 API 凭据     │                       │
│  └───────────────────────────────┘                       │
└─────────────────────────────────────────────────────────┘
```

> **关键约束**：`coze-coding-dev-sdk` 依赖沙箱环境变量（`COZE_INTEGRATION_BASE_URL`、`COZE_WORKLOAD_IDENTITY_API_KEY`、`COZE_INTEGRATION_MODEL_BASE_URL`），这些凭据由平台自动注入，无法迁移到外部平台（如 Vercel）。

---

## 3. 目录结构

```
/workspace/projects/
├── public/
│   ├── extension/                    # Chrome 扩展源文件
│   │   ├── manifest.json             #   扩展清单 (Manifest V3)        → [§5.1]
│   │   ├── popup.html                #   弹窗 UI 骨架                  → [§5.2]
│   │   ├── popup.css                 #   弹窗暗色主题样式               → [§5.3]
│   │   ├── popup.js                  #   弹窗交互逻辑（搜索/分析/收藏）  → [§5.4]
│   │   ├── i18n.js                   #   国际化翻译系统 (中/英)         → [§5.5]
│   │   ├── background.js             #   Service Worker (保活 ping)     → [§5.6]
│   │   └── icons/                    #   扩展图标 (16/32/48/128px)
│   ├── cws-assets/                   # Chrome Web Store 营销素材
│   │   ├── screenshot-1-search.jpeg  #   截图：智能搜索 (1280x800)
│   │   ├── screenshot-2-analyze.jpeg #   截图：AI 深度洞察 (1280x800)
│   │   ├── screenshot-3-favorites.jpeg # 截图：一键收藏 (1280x800)
│   │   ├── small-promo-tile.jpeg     #   小推广图 (440x280)
│   │   └── marquee-promo-tile.jpeg   #   大推广图 (1400x560)
│   ├── archive/                      # 版本备份
│   │   ├── ai-startup-scout-1.0.1.zip
│   │   └── ai-startup-scout-1.1.0.zip
│   └── ai-startup-scout.zip          # 最新版扩展 ZIP（实时打包）
├── src/
│   ├── app/
│   │   ├── layout.tsx                # 根布局                           → [§6]
│   │   ├── page.tsx                  # Landing Page 首页                → [§6.1]
│   │   ├── globals.css               # 全局样式 (Tailwind)
│   │   ├── robots.ts                 # SEO robots.txt 生成
│   │   ├── privacy/
│   │   │   └── page.tsx              # 隐私政策页面                      → [§6.2]
│   │   └── api/
│   │       ├── search/route.ts       # 搜索 API (SearchClient)          → [§4.1]
│   │       ├── analyze/route.ts      # AI 分析 API (LLMClient, SSE)     → [§4.2]
│   │       ├── config/route.ts       # 配置 API (域名+版本号)            → [§4.3]
│   │       ├── download/route.ts     # 扩展 ZIP 下载 API                → [§4.4]
│   │       └── health/route.ts       # 健康检查 API (保活)              → [§4.5]
│   ├── components/ui/                # shadcn/ui 组件库
│   ├── hooks/                        # 自定义 React Hooks
│   └── lib/                          # 工具函数
├── DESIGN.md                         # 设计规范文档
├── AGENTS.md                         # 项目上下文文档
├── PROJECT_DOC.md                    # 本文档
├── next.config.ts                    # Next.js 配置
├── package.json                      # 项目依赖
└── tsconfig.json                     # TypeScript 配置
```

---

## 4. 后端 API 详解

### 4.1 搜索接口 POST /api/search

> 源码：[`src/app/api/search/route.ts`](src/app/api/search/route.ts)

**功能**：接收前端搜索请求，调用 SearchClient 执行 Web 搜索，支持分类过滤和语言本地化。

**请求体**：
```json
{
  "query": "AI agent",           // 必填，搜索关键词
  "category": "funding",         // 可选，分类：all | funding | product | opensource | model
  "count": 10,                   // 可选，结果数量，默认 10
  "locale": "zh-CN"              // 可选，语言标识，默认 "en"
}
```

**响应**：
```json
{
  "success": true,
  "summary": "搜索结果总摘要...",
  "results": [
    {
      "id": "xxx",
      "title": "项目标题",
      "snippet": "项目描述片段",
      "url": "https://...",
      "siteName": "站点名",
      "logoUrl": "https://...",
      "publishTime": "2025-06-01"
    }
  ]
}
```

**核心逻辑**：
1. 解析 `query`、`category`、`count`、`locale` 参数
2. 根据 locale 提取主语言代码（如 `zh-CN` → `zh`），查找分类关键词映射
3. 如果指定了分类（非 `all`），将分类关键词追加到用户搜索词后，增强搜索精确度
   - 例：`query="AI agent"` + `category="funding"` + `locale="en"` → 搜索词变为 `"AI agent AI startup funding investment"`
4. 调用 `SearchClient.advancedSearch()` 执行搜索
5. 格式化 `web_items` 为统一结构返回

**错误处理**：
- `400`：未提供搜索关键词（`query` 为空）
- `500`：搜索服务异常

> 相关代码块：
> - 分类关键词映射：`categoryKeywords` 对象 → [route.ts:21-34](src/app/api/search/route.ts#L21)
> - 搜索词增强逻辑：`searchQuery` 构建 → [route.ts:86-92](src/app/api/search/route.ts#L86)
> - SDK 调用：`client.advancedSearch()` → [route.ts:95-100](src/app/api/search/route.ts#L95)

---

### 4.2 分析接口 POST /api/analyze

> 源码：[`src/app/api/analyze/route.ts`](src/app/api/analyze/route.ts)

**功能**：接收搜索结果，通过 LLMClient 流式生成 AI 分析报告，以 SSE 协议实时推送到前端。

**请求体**：
```json
{
  "query": "AI agent",                          // 必填，搜索关键词
  "results": [{ "title": "...", "snippet": "...", "url": "..." }],  // 搜索结果数组
  "locale": "zh-CN"                              // 可选，语言标识
}
```

**响应**：SSE 流（`Content-Type: text/event-stream`）
```
data: {"content":"你是一位..."}

data: {"content":"## 市场洞察\n"}

data: {"content":"当前AI Agent领域..."}

data: [DONE]
```

**核心逻辑**：
1. 解析参数，根据 locale 选择系统提示词（投资分析师角色，中/英双语）
2. 将搜索结果（最多 8 条）格式化为文本上下文
3. 构建 `messages` 数组：`[system提示词, user消息]`
4. 创建 `ReadableStream`，调用 `LLMClient.stream()` 流式生成
5. 逐块通过 `controller.enqueue()` 以 SSE 格式发送
6. 生成完毕发送 `data: [DONE]` 标记

**错误处理**：
- `400`：未提供分析内容
- SSE 流内错误：发送 `{ error: "分析生成中断" }` 后关闭流
- `500`：非流式异常（请求解析失败等）

> 相关代码块：
> - 系统提示词：`systemPrompts` 对象 → [route.ts:21-56](src/app/api/analyze/route.ts#L21)
> - 搜索结果格式化：`resultsContext` 构建 → [route.ts:127-134](src/app/api/analyze/route.ts#L127)
> - SSE 流创建：`ReadableStream` → [route.ts:151-201](src/app/api/analyze/route.ts#L151)

---

### 4.3 配置接口 GET /api/config

> 源码：[`src/app/api/config/route.ts`](src/app/api/config/route.ts)

**功能**：返回后端服务域名和扩展版本号，供 Chrome 扩展动态获取 API 地址。

**响应**：
```json
{
  "apiBase": "https://xxx.dev.coze.site",
  "extensionVersion": "1.1.1"
}
```

**核心逻辑**：
1. 从 `process.env.COZE_PROJECT_DOMAIN_DEFAULT` 读取域名（已含 `https://` 前缀）
2. 动态 `import()` 读取 `manifest.json` 中的 `version` 字段

> ⚠️ 历史问题修复：域名变量已含 `https://`，不可重复拼接，否则出现 `https://https://...`

> 相关代码块：
> - 域名读取 → [route.ts:18](src/app/api/config/route.ts#L18)
> - 版本号动态读取 → [route.ts:22-28](src/app/api/config/route.ts#L22)

---

### 4.4 下载接口 GET /api/download

> 源码：[`src/app/api/download/route.ts`](src/app/api/download/route.ts)

**功能**：实时打包 Chrome 扩展为 ZIP 文件并返回下载流。

**响应**：`application/zip` 文件流，文件名 `ai-startup-scout.zip`

**核心逻辑**：
1. 校验 `public/extension/` 目录存在
2. 使用 `child_process.execSync` 执行 `zip -r` 命令打包
3. 读取 ZIP Buffer 并以流方式返回

> ⚠️ 系统依赖：需要 `zip` 命令行工具（`apt-get install zip`）

> 相关代码块：
> - ZIP 打包命令 → [route.ts:38](src/app/api/download/route.ts#L38)

---

### 4.5 健康检查 GET /api/health

> 源码：[`src/app/api/health/route.ts`](src/app/api/health/route.ts)

**功能**：轻量级健康检查，供 Chrome 扩展 Service Worker 定时 ping，防止沙箱休眠。

**响应**：
```json
{
  "status": "ok",
  "timestamp": 1717662000000
}
```

> 相关代码块：
> - 响应生成 → [route.ts:14-18](src/app/api/health/route.ts#L14)

---

## 5. Chrome 扩展详解

### 5.1 manifest.json — 扩展清单

> 源码：[`public/extension/manifest.json`](public/extension/manifest.json)

| 字段 | 值 | 说明 |
|------|-----|------|
| `manifest_version` | 3 | Manifest V3 标准 |
| `name` | AI Startup Scout | 扩展名称 |
| `version` | 1.1.1 | 当前版本号 |
| `description` | Search AI startup projects... | 扩展描述 |
| `permissions` | `["storage"]` | 仅需本地存储权限 |
| `action.default_popup` | `popup.html` | 点击图标弹出 popup |
| `background.service_worker` | `background.js` | Service Worker |

> ⚠️ 已移除 `activeTab` 权限和 `host_permissions`，因扩展不需要访问网页内容。

---

### 5.2 popup.html — 弹窗 UI

> 源码：[`public/extension/popup.html`](public/extension/popup.html)

**布局结构**（350x520 限制）：

```
┌─────────────────────────────┐
│ 顶栏：Logo + 标题 + 语言/收藏按钮 │  ← .header
├─────────────────────────────┤
│ 搜索栏：输入框 + 搜索按钮          │  ← .search-section
│ 分类标签：全部/融资/产品/开源/模型   │  ← .category-tabs
├─────────────────────────────┤
│                               │
│ 结果区：可滚动的项目卡片列表        │  ← .results-area
│ （或收藏夹列表 / 空状态 / 加载态）  │
│                               │
├─────────────────────────────┤
│ AI 分析摘要区（可展开）            │  ← .summary-section
├─────────────────────────────┤
│ 底栏：AI 分析按钮 + 结果计数       │  ← .bottom-bar
└─────────────────────────────┘
```

**国际化支持**：所有文案元素添加 `data-i18n` 属性，由 `i18n.js` 在运行时动态替换文本。

> 相关代码块：
> - data-i18n 属性标注 → [popup.html](public/extension/popup.html) 全文
> - 分类标签动态渲染 → popup.js `renderCategoryTabs()` 函数

---

### 5.3 popup.css — 弹窗样式

> 源码：[`public/extension/popup.css`](public/extension/popup.css)

**设计体系**：

| Token | 变量名 | 值 | 用途 |
|-------|--------|-----|------|
| 主背景 | `--bg-base` | `#0F1117` | 深空灰基底 |
| 卡片背景 | `--bg-card` | `#1A1D27` | 卡片/顶栏背景 |
| 提升层 | `--bg-elevated` | `#232736` | 输入框/hover 背景 |
| 强调色 | `--accent` | `#6366F1` | 按钮/链接/选中态 |
| 高亮色 | `--amber` | `#F59E0B` | 收藏/AI 分析标识 |
| 主文字 | `--text-primary` | `#F1F5F9` | 标题/重要文字 |
| 次文字 | `--text-secondary` | `#94A3B8` | 正文/描述 |
| 弱文字 | `--text-muted` | `#64748B` | 辅助信息/占位符 |
| 边框 | `--border` | `#2D3348` | 分割线/卡片边框 |

**动画**：
- `pulse`：骨架屏加载脉冲（1.5s 循环，透明度 1→0.4→1）
- `slideIn`：搜索结果卡片从下方淡入滑入（0.3s，translateY 8px→0）
- `heartBounce`：收藏按钮心形弹跳（0.3s，scale 1→1.3→1）
- `dotPulse`：AI 分析中跳动圆点（1.4s 循环，缩放+透明度）

---

### 5.4 popup.js — 弹窗交互逻辑

> 源码：[`public/extension/popup.js`](public/extension/popup.js)

**核心函数**：

| 函数 | 功能 | 调用时机 |
|------|------|----------|
| `init()` | 初始化入口：获取配置、渲染分类标签、绑定事件 | DOMContentLoaded |
| `fetchConfig()` | 调用 /api/config 获取后端域名和版本号 | 初始化时 |
| `renderCategoryTabs()` | 根据 locale 动态渲染分类标签（中/英文） | 初始化/语言切换后 |
| `performSearch(query)` | 执行搜索：调用 /api/search，渲染结果卡片 | 搜索按钮点击/回车 |
| `renderResults(results)` | 将搜索结果渲染为卡片列表 | 搜索成功后 |
| `createResultCard(item, index)` | 创建单个结果卡片 DOM（含收藏按钮） | 渲染结果时 |
| `toggleFavorite(item)` | 切换收藏状态：添加/移除 chrome.storage | 收藏按钮点击 |
| `loadFavorites()` | 加载收藏夹列表并渲染 | 收藏夹图标点击 |
| `removeFavorite(url)` | 从收藏夹中移除指定项目 | 收藏卡片删除按钮 |
| `analyzeResults(query, results)` | 调用 /api/analyze（SSE 流式），逐块渲染分析内容 | AI 分析按钮点击 |
| `switchLanguage(lang)` | 切换界面语言，重新渲染分类标签和文案 | 语言切换按钮点击 |

**数据存储**：
- 收藏数据存储在 `chrome.storage.local`，key 为 `"favorites"`
- 数据结构：`[{ title, snippet, url, siteName, timestamp }]`
- 去重逻辑：以 `url` 为唯一标识

**API 调用模式**：
- 搜索：标准 `fetch` + `response.json()`
- 分析：`fetch` + `response.body.getReader()` 逐块读取 SSE 流
- 所有请求携带 `locale` 参数（从 `i18n.js` 的 `detectLocale()` 获取）

> 相关代码块：
> - 搜索核心逻辑 → `performSearch()` 函数
> - SSE 流式读取 → `analyzeResults()` 函数
> - 收藏存储 → `toggleFavorite()` / `loadFavorites()` 函数

---

### 5.5 i18n.js — 国际化系统

> 源码：[`public/extension/i18n.js`](public/extension/i18n.js)

**支持的 API**：

| 函数 | 功能 |
|------|------|
| `detectLocale()` | 检测浏览器语言，返回 `"zh-CN"` 或 `"en"` |
| `t(key)` | 根据当前 locale 翻译指定 key |
| `applyTranslations()` | 遍历所有 `[data-i18n]` 元素，替换文本内容 |
| `getCurrentLocale()` | 获取当前语言标识 |
| `setLocale(lang)` | 设置语言并重新应用翻译 |

**翻译字典结构**：
```javascript
const translations = {
  en: {
    appTitle: "AI Startup Scout",
    searchPlaceholder: "Search AI startups...",
    tabAll: "All",
    tabFunding: "Funding",
    // ...约 30+ 个 key
  },
  zh: {
    appTitle: "AI 创业侦察兵",
    searchPlaceholder: "搜索AI创业项目...",
    tabAll: "全部",
    tabFunding: "融资",
    // ...约 30+ 个 key
  }
};
```

**语言检测逻辑**：
1. 优先从 `chrome.storage.local` 读取用户手动设置的语言
2. 若无手动设置，使用 `navigator.language` 自动检测
3. 中文环境（`zh-*`）→ `"zh-CN"`，其他 → `"en"`

> 相关代码块：
> - 语言检测 → `detectLocale()` 函数
> - 翻译字典 → `translations` 对象

---

### 5.6 background.js — Service Worker

> 源码：[`public/extension/background.js`](public/extension/background.js)

**功能**：

1. **配置初始化**：扩展安装/启动时调用 `/api/config` 获取后端域名，存入 `chrome.storage.local`
2. **保活机制**：每 4 分钟 ping `/api/health`，防止沙箱环境因空闲而休眠

**保活逻辑**：
```
安装/启动 → fetchConfig() → 存储域名
    ↓
setInterval(4min) → fetch /api/health → 如果失败则重新 fetchConfig()
```

> 相关代码块：
> - 配置获取 → `fetchConfig()` 函数
> - 保活定时器 → `setInterval(keepAlive, 240000)` （4 分钟）

---

## 6. 前端页面详解

### 6.1 Landing Page — 首页

> 源码：[`src/app/page.tsx`](src/app/page.tsx)

**页面结构**：

| 区块 | 内容 |
|------|------|
| Hero | 产品大标题 + 副标题 + Chrome Web Store 安装按钮 + 扩展下载链接 |
| 特性展示 | 4 个功能卡片：智能搜索、AI 分析、一键收藏、中英双语 |
| 使用方式 | 安装步骤指引（3 步） |
| Footer | 版权信息 |

**动态数据**：
- 下载链接使用 `COZE_PROJECT_DOMAIN_DEFAULT` 环境变量构造，避免硬编码域名
- 使用 `'use client'` + `useEffect` + `useState` 处理客户端渲染，避免 Hydration 错误

---

### 6.2 Privacy Page — 隐私政策

> 源码：[`src/app/privacy/page.tsx`](src/app/privacy/page.tsx)

**用途**：Chrome Web Store 上架要求的隐私政策页面。

**内容要点**：
- 不收集个人数据
- 不使用跟踪器或广告
- 搜索数据仅在会话中使用
- 收藏数据存储在本地 chrome.storage

**外部版本**：GitHub Pages 版本部署在 `https://linwenzhi1314.github.io/ai-startup-scout/privacy.html`，用于 Chrome Web Store 填写隐私政策 URL。

> 源码：[`public/privacy-github.html`](public/privacy-github.html)

---

## 7. 数据流图

### 搜索流程

```
用户输入关键词 → popup.js performSearch()
  → POST /api/search { query, category, locale }
    → SearchClient.advancedSearch(增强搜索词)
      → 返回 { web_items, summary }
    → 格式化结果
  ← 返回 { success, summary, results }
→ popup.js renderResults()
  → 创建结果卡片 DOM
  → 绑定收藏按钮事件
```

### AI 分析流程

```
用户点击"AI 分析" → popup.js analyzeResults()
  → POST /api/analyze { query, results, locale }
    → LLMClient.stream(messages)
      → for await (chunk of stream)
        → SSE: data: {"content":"..."}\n\n
      → SSE: data: [DONE]\n\n
  ← ReadableStream (SSE)
→ popup.js getReader() 逐块读取
  → 实时追加到 .summary-content
  → 遇到 [DONE] 关闭读取
```

### 收藏流程

```
用户点击收藏 → popup.js toggleFavorite(item)
  → chrome.storage.local.get("favorites")
  → 检查 url 是否已存在
    → 已存在：从数组中移除
    → 不存在：添加到数组
  → chrome.storage.local.set({ favorites: [...] })
  → 更新按钮样式（heartBounce 动画）
```

---

## 8. 国际化机制

### 全链路本地化

```
浏览器语言 (navigator.language)
  ↓
i18n.js detectLocale() → "zh-CN" / "en"
  ↓
┌───────────────────────────────────┐
│ popup.js                          │
│   UI 文案 → t(key) 翻译           │
│   分类标签 → renderCategoryTabs() │
│   API 请求 → 携带 locale 参数     │
└───────────┬───────────────────────┘
            ↓
┌───────────────────────────────────┐
│ 后端 API                          │
│   /api/search → 按 locale 追加关键词 │
│   /api/analyze → 按 locale 选提示词 │
└───────────────────────────────────┘
```

**关键设计**：
- 前端 UI 和后端内容同步本地化
- 搜索词增强：英文用户搜索 `"AI agent"` + 融资分类 → `"AI agent AI startup funding investment"`
- AI 分析：中文用户获得中文分析报告，英文用户获得英文报告

---

## 9. 版本管理规范

| 变更级别 | 版本规则 | 示例 |
|----------|----------|------|
| 小改（修 bug、改文案、调样式） | patch +1 | 1.0.1 → 1.0.2 |
| 大改（新功能、架构调整） | minor +1 | 1.0.x → 1.1.0 |
| 重大更新（整体重构） | major +1 | 1.x → 2.0.0 |

**每次更新必须执行**：
1. 更新 `manifest.json` 中的 `version` 字段
2. 重新打包 ZIP：`cd public/extension && zip -r ../ai-startup-scout.zip .`
3. 备份到 `public/archive/`：`cp public/ai-startup-scout.zip public/archive/ai-startup-scout-{version}.zip`

**版本历史**：

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| 1.0.0 | - | 初始版本：搜索 + AI 分析 + 收藏 |
| 1.0.1 | - | 修复图标格式（JPEG→PNG），移除 activeTab 权限 |
| 1.1.0 | - | 大改：添加中英双语国际化支持 |
| 1.1.1 | - | 添加服务保活机制（background.js 定时 ping） |

---

## 10. 部署与运维

### 沙箱环境

| 环境变量 | 说明 |
|----------|------|
| `COZE_WORKSPACE_PATH` | 项目工作目录 `/workspace/projects/` |
| `COZE_PROJECT_DOMAIN_DEFAULT` | 对外访问域名（含 `https://`） |
| `DEPLOY_RUN_PORT` | 服务监听端口 `5000` |
| `COZE_PROJECT_ENV` | 环境标识 `DEV` / `PROD` |

### SDK 依赖的环境变量（沙箱自动注入）

| 变量 | 用途 |
|------|------|
| `COZE_INTEGRATION_BASE_URL` | 搜索 API 地址 |
| `COZE_WORKLOAD_IDENTITY_API_KEY` | API 身份认证密钥 |
| `COZE_INTEGRATION_MODEL_BASE_URL` | 模型 API 地址 |

> ⚠️ 这些凭据由沙箱平台自动注入，无法复制到 Vercel/Railway 等外部平台。

### 扩展打包命令

```bash
cd public/extension && zip -r ../ai-startup-scout.zip .
```

### 保活策略

- 扩展端：`background.js` 每 4 分钟 fetch `/api/health`
- 如果 ping 失败，重新获取配置并重试
- GitHub Pages 隐私政策作为备用，不依赖沙箱在线

---

## 11. 已知限制与待办

### 当前限制

1. **沙箱依赖**：`coze-coding-dev-sdk` 绑定沙箱环境变量，无法部署到外部平台
2. **保活不完美**：沙箱可能因维护重启，扩展 ping 期间可能短暂不可用
3. **仅中英双语**：i18n 框架已支持扩展，但暂未添加其他语言翻译

### 待办

- [ ] 评估替换 SDK 为独立 API（Tavily/Brave Search + DeepSeek/OpenAI），解除沙箱依赖
- [ ] 添加更多语言支持（日语、韩语等）
- [ ] 优化搜索结果去重和排序
- [ ] 添加搜索历史功能
