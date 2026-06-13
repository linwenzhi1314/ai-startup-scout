---
AIGC:
    Label: "1"
    ContentProducer: 001191110102MACQD9K64018705
    ProduceID: 2438089245472268_0-data_volume/7649222789794349350-files/所有对话/主对话/AI-Startup-Scout商业化/GA4接入指引.md
    ReservedCode1: ""
    ContentPropagator: 001191110102MACQD9K64028705
    PropagateID: 2438089245472268#1781166961919
    ReservedCode2: ""
---
# AI Startup Scout - Google Analytics 4 接入指引

> 目的：从第一天起追踪用户行为，让每一步决策都有数据支撑
> 适用版本：Chrome Extension (Manifest V3)
> GA版本：Google Analytics 4 (GA4)

---

## 一、为什么必须接GA

没有GA你会面临的问题：
- 不知道用户装了之后有没有打开过 → 无法判断留存
- 不知道用户搜索了什么关键词 → 无法优化推荐
- 不知道AI分析功能用没用 → 无法判断核心价值是否被感知
- 不知道用户在哪个步骤流失 → 无法优化转化漏斗

**一句话：没有数据，所有优化都是猜。**

---

## 二、GA4 创建与配置

### 2.1 创建GA4 Property

1. 打开 [Google Analytics](https://analytics.google.com/)
2. 点击「创建账号」→ 填写账号名称（如 `AI Startup Scout`）
3. 创建媒体资源：
   - 媒体资源名称：`AI Startup Scout - Chrome Extension`
   - 报表时区：`中国 (UTC+08:00)`
   - 货币：`人民币 (CNY ¥)`
4. 平台选择：选择「网站和应用」→ 选择「网站」
   - 网站网址：填你的Vercel官网 `https://ai-startup-scout.vercel.app`
   - 数据流名称：`Chrome Extension`
5. 获取 **衡量 ID**（格式：`G-XXXXXXXXXX`），记下来，代码里要用

### 2.2 关键配置项

| 配置项 | 设置 | 原因 |
|--------|------|------|
| 数据留存 | 14个月（最大值） | 免费版默认2个月，要手动改 |
| 用户识别 | 「按 User-ID 和设备」 | 后续接付费体系时需要跨设备追踪 |
| Google 信号 | 开启 | 启用后可获得更多用户特征数据 |
| 数据过滤器 | 排除你自己的开发设备IP | Settings → Data Filters → 排除内网流量 |

---

## 三、Chrome Extension 接入 GA4

### 3.1 技术方案选择

Chrome Extension 有三种接入GA的方式：

| 方案 | 优点 | 缺点 | 推荐 |
|------|------|------|------|
| A. gtag.js 直接引入 | 最标准 | Manifest V3 CSP限制，不允许远程脚本 | ❌ 不可用 |
| B. Measurement Protocol | 无CSP限制，纯HTTP请求 | 需手动构造请求 | ✅ **推荐** |
| C. Firebase Analytics | Google官方推荐 | 配置复杂，需要Firebase项目 | 备选 |

**推荐方案B：GA4 Measurement Protocol**

原理：直接向GA4的收集端点发HTTP POST请求，不依赖gtag.js，完全兼容Manifest V3的CSP策略。

### 3.2 核心代码实现

**新建文件：`analytics.js`**

```javascript
/**
 * AI Startup Scout - GA4 Analytics Module
 * 使用 Measurement Protocol V2 发送事件
 * 无需 gtag.js，兼容 Manifest V3 CSP
 */

const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // ← 替换为你的衡量ID
const GA_API_SECRET = 'xxxxxxxxxxxx';      // ← 替换为你的API Secret（见3.3节）
const GA_ENDPOINT = 'https://www.google-analytics.com/mp/collect';

// 获取或生成客户端ID（区分不同用户）
function getClientId() {
  let cid = localStorage.getItem('ga_client_id');
  if (!cid) {
    cid = crypto.randomUUID(); // 生成唯一ID
    localStorage.setItem('ga_client_id', cid);
  }
  return cid;
}

// 获取或生成会话ID（区分不同会话）
let sessionId = null;
let sessionStartTime = null;

function getSessionId() {
  if (!sessionId || Date.now() - sessionStartTime > 30 * 60 * 1000) {
    // 新会话：超过30分钟无活动则创建新会话
    sessionId = crypto.randomUUID();
    sessionStartTime = Date.now();
  }
  return sessionId;
}

/**
 * 发送事件到GA4
 * @param {string} eventName - 事件名称
 * @param {object} params - 事件参数
 */
async function trackEvent(eventName, params = {}) {
  try {
    const payload = {
      client_id: getClientId(),
      events: [{
        name: eventName,
        params: {
          session_id: getSessionId(),
          engagement_time_msec: 100, // 默认互动时间
          ...params
        }
      }]
    };

    await fetch(
      `${GA_ENDPOINT}?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`,
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    );
  } catch (e) {
    // 埋点失败不影响主功能
    console.warn('Analytics error:', e);
  }
}

/**
 * 发送页面浏览事件
 * @param {string} pageName - 页面名称
 */
function trackPageView(pageName) {
  trackEvent('page_view', {
    page_title: pageName,
    page_location: `chrome-extension://popup/${pageName}`
  });
}
```

### 3.3 获取 API Secret

1. 打开 GA4 → 管理员 → 数据流 → 选择你的数据流
2. 点击「衡量协议 ID」→ 「创建」
3. 填写昵称（如 `chrome-extension`）→ 生成 API Secret
4. 把这个值填入上面代码的 `GA_API_SECRET`

### 3.4 在 popup.js 中接入埋点

在 `init()` 函数里初始化，在各功能入口加埋点：

```javascript
// ==== 在 init() 函数中添加 ====
async function init() {
  await loadConfig();
  loadFavorites();
  applyLocale();

  // ✅ 埋点：插件打开
  trackPageView('popup');
  trackEvent('extension_opened', {
    locale: currentLocale,
    has_favorites: favorites.length > 0
  });

  // ... 原有事件绑定代码 ...
}

// ==== 修改 search() 函数，加埋点 ====
async function search(query) {
  if (isSearching || !query.trim()) return;

  // ✅ 埋点：搜索
  trackEvent('search_performed', {
    search_query_length: query.length,
    category: currentCategory,
    locale: currentLocale
  });

  isSearching = true;
  // ... 原有搜索逻辑 ...
  
  try {
    const resp = await fetch(`${API_BASE}/api/search`, { ... });
    const data = await resp.json();
    searchResults = data.results || [];

    // ✅ 埋点：搜索结果
    trackEvent('search_completed', {
      result_count: searchResults.length,
      category: currentCategory,
      has_results: searchResults.length > 0
    });
    // ...
  } catch (error) {
    // ✅ 埋点：搜索失败
    trackEvent('search_failed', {
      category: currentCategory,
      error_type: 'network'
    });
    // ...
  }
}

// ==== 修改 analyzeResults() 函数，加埋点 ====
async function analyzeResults() {
  if (isAnalyzing || searchResults.length === 0) return;

  // ✅ 埋点：AI分析
  trackEvent('ai_analyze_clicked', {
    result_count: searchResults.length,
    category: currentCategory,
    locale: currentLocale
  });

  // ... 原有分析逻辑 ...
  
  try {
    // 流式读取完成后
    // ✅ 埋点：分析完成
    trackEvent('ai_analyze_completed', {
      content_length: summaryContent.length,
      category: currentCategory
    });
  } catch (error) {
    // ✅ 埋点：分析失败
    trackEvent('ai_analyze_failed', { error_type: 'network' });
  }
}

// ==== 修改 toggleFavorite() 函数，加埋点 ====
function toggleFavorite(result) {
  const wasFavorited = isFavorite(result.id);
  
  // 原有逻辑
  const idx = favorites.findIndex(f => f.id === result.id);
  if (idx >= 0) {
    favorites.splice(idx, 1);
  } else {
    favorites.push({ ...result, favoritedAt: Date.now() });
  }
  saveFavorites();

  // ✅ 埋点：收藏操作
  trackEvent(wasFavorited ? 'favorite_removed' : 'favorite_added', {
    result_id: result.id,
    total_favorites: favorites.length
  });
}

// ==== 修改 toggleLocale() 函数，加埋点 ====
function toggleLocale() {
  const fromLocale = currentLocale;
  currentLocale = currentLocale === 'en' ? 'zh' : 'en';
  localStorage.setItem('aiScoutLocale', currentLocale);
  applyLocale();

  // ✅ 埋点：语言切换
  trackEvent('language_switched', {
    from: fromLocale,
    to: currentLocale
  });
  // ...
}

// ==== 修改 selectCategory() 函数，加埋点 ====
function selectCategory(category) {
  currentCategory = category;
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.category === category);
  });

  // ✅ 埋点：分类切换
  trackEvent('category_selected', { category });
}
```

---

## 四、完整事件清单

### 4.1 核心事件（必须埋）

| 事件名 | 触发时机 | 关键参数 | 对应指标 |
|--------|---------|---------|---------|
| `extension_opened` | 用户点击插件图标弹出popup | locale, has_favorites | DAU / 打开频次 |
| `search_performed` | 用户发起搜索 | category, query_length | 搜索频率 |
| `search_completed` | 搜索返回结果 | result_count, category | 搜索成功率 |
| `search_failed` | 搜索失败 | category, error_type | 故障率 |
| `ai_analyze_clicked` | 用户点击AI分析按钮 | result_count, category | 分析功能使用率 |
| `ai_analyze_completed` | AI分析流式输出完成 | content_length | 分析完成率 |
| `ai_analyze_failed` | AI分析失败 | error_type | 分析故障率 |
| `page_view` | popup打开 | page_title | 页面浏览 |

### 4.2 行为事件（应该埋）

| 事件名 | 触发时机 | 关键参数 | 对应指标 |
|--------|---------|---------|---------|
| `category_selected` | 用户切换分类标签 | category | 各分类使用占比 |
| `favorite_added` | 用户收藏项目 | result_id, total_favorites | 收藏率 |
| `favorite_removed` | 用户取消收藏 | result_id, total_favorites | — |
| `language_switched` | 用户切换语言 | from, to | 中英文用户比例 |
| `result_link_clicked` | 用户点击搜索结果的链接 | result_id, category | 外链点击率 |
| `favorite_view_entered` | 用户进入收藏夹视图 | total_favorites | 收藏夹使用率 |
| `feedback_clicked` | 用户点击反馈按钮 | — | 反馈意愿 |

### 4.3 付费相关事件（第5-8周接入付费后埋）

| 事件名 | 触发时机 | 关键参数 |
|--------|---------|---------|
| `paywall_shown` | 免费次数用完弹出升级提示 | feature, remaining_count |
| `upgrade_clicked` | 用户点击升级按钮 | feature, plan |
| `purchase_started` | 用户进入支付流程 | plan, price |
| `purchase_completed` | 支付成功 | plan, price, currency |
| `purchase_failed` | 支付失败 | plan, error_type |

---

## 五、GA4 自定义维度和指标

在 GA4 管理员 → 自定义定义 中创建：

### 5.1 自定义维度（事件范围）

| 维度名 | 事件参数 | 用途 |
|--------|---------|------|
| `category` | category | 按分类分析用户偏好 |
| `locale` | locale | 中英文用户对比 |
| `search_result_count` | result_count | 搜索质量分析 |
| `feature` | feature | 付费触达分析 |

### 5.2 自定义指标（事件范围）

| 指标名 | 事件参数 | 单位 | 用途 |
|--------|---------|------|------|
| `search_results` | result_count | 标准 | 平均搜索结果数 |
| `analyze_content_length` | content_length | 标准 | AI分析内容长度 |

---

## 六、核心数据看板搭建

### 6.1 「每日健康度」看板

在 GA4 → 探索 → 空白（自由形式）创建：

| 卡片 | 指标 | 维度 | 用途 |
|------|------|------|------|
| 日活用户 | `event_count` where event=extension_opened | 日期 | DAU趋势 |
| 搜索次数 | `event_count` where event=search_performed | 日期 | 使用频次 |
| AI分析使用率 | search_completed数 ÷ ai_analyze_clicked数 | 日期 | 核心功能渗透率 |
| 搜索成功率 | search_completed数 ÷ (search_completed+search_failed) | 日期 | 产品稳定性 |
| 留存率 | GA4内置留存报告 | 第1/3/7/30天 | 用户粘性 |

### 6.2 「用户行为」看板

| 卡片 | 指标 | 维度 | 用途 |
|------|------|------|------|
| 分类偏好 | `event_count` where event=category_selected | category | 哪个分类最火 |
| 语言分布 | `event_count` where event=extension_opened | locale | 中英文比例 |
| 收藏率 | favorite_added ÷ search_completed | 日期 | 结果价值感知 |
| 外链点击率 | result_link_clicked ÷ search_completed | 日期 | 结果行动力 |

### 6.3 「付费漏斗」看板（第5-8周后创建）

```
extension_opened → search_performed → ai_analyze_clicked → paywall_shown → upgrade_clicked → purchase_completed
```

每步转化率 = 下一步事件数 ÷ 上一步事件数

---

## 七、Manifest V3 注意事项

### 7.1 CSP 配置

当前 manifest.json 的 CSP：
```json
"content_security_policy": {
  "extension_pages": "script-src 'self'; object-src 'self'"
}
```

**不需要修改！** Measurement Protocol 方案是纯 fetch HTTP 请求，不违反 CSP 限制。

### 7.2 权限

当前 manifest.json 的权限只有 `storage`，**不需要额外权限**。GA4 的 fetch 请求不需要 `host_permissions`，因为 GA 的域名不在扩展的限制范围内。

> ⚠️ 如果你未来想追踪用户在哪些网站使用了插件（Content Script场景），才需要加 `host_permissions`。当前 popup 方案不需要。

### 7.3 隐私合规

Chrome Web Store 审核可能询问数据收集情况，需要：

1. **在 manifest.json 中没有请求敏感权限** ✅ 已满足
2. **在Chrome商店的"隐私实践"中声明数据收集**：
   - 填写：收集「使用数据」（搜索查询不记录原文，只记录长度和分类）
   - 不收集「个人身份信息」
   - 数据用于「分析和改进产品」
3. **在插件内提供隐私政策链接**（可在Vercel部署一个简单的privacy页面）

**简单隐私政策模板：**
```
AI Startup Scout 隐私政策

我们使用 Google Analytics 收集匿名使用数据（如功能使用频率、搜索分类偏好），
以改进产品体验。我们不收集个人身份信息、搜索关键词原文或浏览历史。

数据仅用于产品优化，不会出售或分享给第三方。

如有疑问，请联系：[你的邮箱]
```

---

## 八、调试与验证

### 8.1 实时验证

1. 打开 GA4 → 报告 → 实时
2. 在浏览器安装插件并操作
3. 观察实时报告中是否出现事件

### 8.2 DebugView

1. 安装 [GA Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger) 扩展
2. 开启调试模式后，在 GA4 → 管理员 → DebugView 中可实时查看所有事件

### 8.3 测试代码

在插件加载后，打开 DevTools Console 手动测试：

```javascript
// 测试事件发送
trackEvent('test_event', { test_param: 'hello' });

// 检查客户端ID
console.log('Client ID:', getClientId());
```

---

## 九、接入时间表

| 任务 | 预计耗时 | 在行动手册中的位置 |
|------|---------|-------------------|
| 创建GA4 Property + 获取衡量ID | 30分钟 | 第1周 |
| 创建 analytics.js 模块 | 1小时 | 第1周 |
| 在 popup.js 中接入核心埋点 | 2小时 | 第1周 |
| 创建自定义维度和指标 | 30分钟 | 第1周 |
| 搭建数据看板 | 1小时 | 第1周 |
| 部署隐私政策页面 | 30分钟 | 第1周 |
| Chrome商店更新隐私声明 | 15分钟 | 第1周 |
| **总计** | **约6小时** | **第1周内完成** |

---

## 十、关键指标速查

接入GA后，每天关注这5个数字：

| # | 指标 | 健康值 | 危险值 | 看哪 |
|---|------|--------|--------|------|
| 1 | DAU（日活） | >安装数×30% | <安装数×10% | 实时报告 |
| 2 | 搜索完成率 | >90% | <70% | 自定义看板 |
| 3 | AI分析使用率 | >30%的搜索者 | <10% | 自定义看板 |
| 4 | 次日留存 | >25% | <10% | 留存报告 |
| 5 | 收藏率 | >15%的搜索者 | <5% | 自定义看板 |

---

> 本内容由 Coze AI 生成，请遵循相关法律法规及《人工智能生成合成内容标识办法》使用与传播。
