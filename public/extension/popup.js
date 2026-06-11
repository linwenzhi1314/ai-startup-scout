/* ========================================
   AI Startup Scout - Popup Logic (v1.1.1)
   With i18n support: auto-detect locale
   ======================================== */

// ---- 应用状态变量 ----
let currentView = 'search';   // 当前视图模式：'search' 搜索 | 'favorites' 收藏夹
let currentCategory = 'all';  // 当前选中的分类：'all' | 'funding' | 'product' | 'opensource' | 'model'
let searchResults = [];       // 搜索结果数组，存储当前搜索返回的项目列表
let favorites = [];           // 收藏列表数组，存储用户收藏的项目
let summaryVisible = false;   // AI 分析面板是否可见
let summaryContent = '';      // AI 分析面板当前内容（累积的 Markdown 文本）
let isSearching = false;      // 是否正在搜索中（防止重复请求）
let isAnalyzing = false;      // 是否正在 AI 分析中（防止重复请求）
let API_BASE = '';            // 后端 API 基地址，启动时从配置接口获取

// ---- 配置加载 ----
/**
 * 从后端 /api/config 接口加载 API 基地址
 * 如果配置接口不可用，使用硬编码的回退地址
 */
async function loadConfig() {
  try {
    const resp = await fetch('https://ai-startup-scout.vercel.app/api/config');
    if (resp.ok) {
      const config = await resp.json();
      API_BASE = config.apiBase; // 从后端获取动态域名
    }
  } catch (e) {
    // 配置接口请求失败，使用回退地址
    console.warn('Failed to load config, using fallback');
  }
  // 如果未能获取到配置，使用硬编码的回退地址
  if (!API_BASE) {
    API_BASE = 'https://ai-startup-scout.vercel.app';
  }
}

// ---- 收藏功能 ----
/**
 * 从 localStorage 加载收藏列表
 * 存储键名：'aiScoutFavorites'
 */
function loadFavorites() {
  try {
    const data = localStorage.getItem('aiScoutFavorites');
    favorites = data ? JSON.parse(data) : []; // 解析 JSON，无数据时为空数组
  } catch (e) {
    favorites = []; // 解析失败时重置为空数组
  }
}

/**
 * 将收藏列表保存到 localStorage
 */
function saveFavorites() {
  localStorage.setItem('aiScoutFavorites', JSON.stringify(favorites));
}

/**
 * 判断指定项目是否已收藏
 * @param id - 项目唯一标识
 * @returns 是否已收藏
 */
function isFavorite(id) {
  return favorites.some(f => f.id === id);
}

/**
 * 切换项目的收藏状态
 * 已收藏则移除，未收藏则添加（附加收藏时间戳）
 * @param result - 搜索结果对象
 */
function toggleFavorite(result) {
  const idx = favorites.findIndex(f => f.id === result.id);
  if (idx >= 0) {
    favorites.splice(idx, 1);  // 已收藏：从列表中移除
  } else {
    favorites.push({ ...result, favoritedAt: Date.now() }); // 未收藏：添加并记录时间
  }
  saveFavorites(); // 持久化到 localStorage
}

// ---- 搜索功能 ----
/**
 * 执行搜索请求
 * 1. 组装搜索词（用户输入 + 分类关键词）
 * 2. 调用后端 /api/search 接口
 * 3. 渲染搜索结果卡片
 * @param query - 用户输入的搜索关键词
 */
async function search(query) {
  // 防止重复搜索或空关键词
  if (isSearching || !query.trim()) return;
  isSearching = true;
  // 重置 AI 分析状态
  summaryVisible = false;
  summaryContent = '';
  document.getElementById('summaryPanel').style.display = 'none'; // 隐藏分析面板

  // 获取 DOM 元素引用
  const resultsContainer = document.getElementById('results');     // 结果容器
  const emptyState = document.getElementById('emptyState');       // 空状态提示
  const loadingIndicator = document.getElementById('loading');     // 加载指示器
  const resultCount = document.getElementById('resultCount');     // 结果计数

  // 切换 UI 状态：隐藏空状态，显示加载中
  emptyState.style.display = 'none';
  loadingIndicator.style.display = 'flex';
  resultsContainer.innerHTML = ''; // 清空旧结果
  document.getElementById('analyzeBtn').disabled = true; // 搜索中禁用分析按钮

  try {
    // 根据当前分类获取补充关键词
    const categoryKeyword = getCategoryKeyword(currentCategory);
    // 拼接完整搜索词：分类关键词 + 用户输入
    const fullQuery = `${categoryKeyword} ${query}`.trim();

    // 发送搜索请求到后端 API
    const resp = await fetch(`${API_BASE}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: fullQuery,               // 完整搜索词
        category: currentCategory,       // 当前分类
        count: 8,                        // 请求结果数量
        locale: currentLocale            // 当前语言
      })
    });

    // 检查 HTTP 响应状态
    if (!resp.ok) throw new Error('Search failed');

    // 解析响应 JSON
    const data = await resp.json();
    searchResults = data.results || []; // 保存搜索结果到全局状态

    // 处理无结果的情况
    if (searchResults.length === 0) {
      resultsContainer.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <p data-i18n="noResults">${t('noResults')}</p>
          <p class="no-results-desc" data-i18n="noResultsDesc">${t('noResultsDesc')}</p>
        </div>`;
      resultCount.textContent = '';
      // 无结果时禁用 AI 分析按钮
      document.getElementById('analyzeBtn').disabled = true;
    } else {
      // 有结果：更新计数并渲染结果卡片
      resultCount.textContent = t('resultCount').replace('{count}', searchResults.length);
      searchResults.forEach((result, index) => {
        const card = createResultCard(result, index); // 创建卡片 DOM
        resultsContainer.appendChild(card);             // 追加到容器
      });
      // 搜索有结果时启用 AI 分析按钮
      document.getElementById('analyzeBtn').disabled = false;
    }
  } catch (error) {
    // 搜索失败：显示错误状态
    resultsContainer.innerHTML = `
      <div class="error-state">
        <p data-i18n="searchError">${t('searchError')}</p>
        <button class="retry-btn" onclick="retrySearch()" data-i18n="retryBtn">${t('retryBtn')}</button>
      </div>`;
    resultCount.textContent = '';
  } finally {
    // 无论成功或失败，隐藏加载指示器
    loadingIndicator.style.display = 'none';
    isSearching = false; // 重置搜索状态
  }
}

/**
 * 重试搜索：使用当前输入框中的关键词重新搜索
 */
function retrySearch() {
  const query = document.getElementById('searchInput').value;
  search(query);
}

/**
 * 创建搜索结果卡片 DOM 元素
 * @param result - 单条搜索结果数据
 * @param index - 结果索引，用于设置动画延迟
 * @returns 卡片 DOM 元素
 */
function createResultCard(result, index) {
  const card = document.createElement('div');
  card.className = 'result-card';
  // 设置入场动画延迟，实现逐个滑入效果
  card.style.animationDelay = `${index * 0.05}s`;

  // 检查该结果是否已收藏
  const fav = isFavorite(result.id);
  // 提取域名（去掉 www. 前缀）
  const domain = result.url ? new URL(result.url).hostname.replace('www.', '') : '';
  // 格式化发布时间
  const publishTime = result.publishTime
    ? formatDate(result.publishTime)
    : '';

  // 构建卡片 HTML 结构
  card.innerHTML = `
    <div class="card-header">
      <div class="card-title-row">
        <h3 class="card-title">${escapeHtml(result.title)}</h3>
        <button class="fav-btn ${fav ? 'active' : ''}" data-id="${result.id}" title="${fav ? t('removeFromFav') : t('addToFav')}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${fav ? '#F59E0B' : 'none'}" stroke="${fav ? '#F59E0B' : '#64748b'}" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
    </div>
    <p class="card-snippet">${escapeHtml(result.snippet || '')}</p>
    <div class="card-footer">
      <div class="card-meta">
        ${result.siteName ? `<span class="card-source">${escapeHtml(result.siteName)}</span>` : ''}
        ${publishTime ? `<span class="card-time">${publishTime}</span>` : ''}
      </div>
      <a class="card-link" href="${result.url}" target="_blank" rel="noopener" data-i18n-title="viewSource" title="${t('viewSource')}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </a>
    </div>`;

  // 收藏按钮点击事件：切换收藏状态并更新图标
  card.querySelector('.fav-btn').addEventListener('click', (e) => {
    e.stopPropagation();                          // 阻止事件冒泡
    toggleFavorite(result);                       // 切换收藏状态
    const btn = card.querySelector('.fav-btn');
    const isFav = isFavorite(result.id);          // 检查最新状态
    btn.classList.toggle('active');                // 切换 active 样式
    btn.querySelector('svg').setAttribute('fill', isFav ? '#F59E0B' : 'none');     // 更新填充色
    btn.querySelector('svg').setAttribute('stroke', isFav ? '#F59E0B' : '#64748b'); // 更新描边色
    btn.title = isFav ? t('removeFromFav') : t('addToFav'); // 更新悬停提示
  });

  // 卡片点击事件：点击标题和描述区域打开链接
  const cardHeader = card.querySelector('.card-header');
  const cardSnippet = card.querySelector('.card-snippet');
  const openUrl = function(e) {
    e.stopPropagation();
    if (result.url) {
      chrome.tabs.create({ url: result.url });
    }
  };
  if (cardHeader) {
    cardHeader.style.cursor = 'pointer';
    cardHeader.addEventListener('click', openUrl);
  }
  if (cardSnippet) {
    cardSnippet.style.cursor = 'pointer';
    cardSnippet.addEventListener('click', openUrl);
  }

  return card;
}

/**
 * 格式化日期为相对时间文本
 * 根据当前语言环境返回不同的格式（如"3天前" vs "3d ago"）
 * @param dateStr - ISO 日期字符串
 * @returns 格式化后的相对时间文本
 */
function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;             // 时间差（毫秒）
    const days = Math.floor(diff / 86400000); // 转换为天数

    if (currentLocale === 'zh') {
      // 中文相对时间格式
      if (days === 0) return '今天';
      if (days === 1) return '昨天';
      if (days < 7) return `${days}天前`;
      if (days < 30) return `${Math.floor(days / 7)}周前`;
      return `${date.getMonth() + 1}月${date.getDate()}日`; // 超过一个月显示月日
    } else {
      // 英文相对时间格式
      if (days === 0) return 'Today';
      if (days === 1) return 'Yesterday';
      if (days < 7) return `${days}d ago`;
      if (days < 30) return `${Math.floor(days / 7)}w ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); // 如 "Jun 3"
    }
  } catch {
    return ''; // 日期解析失败时返回空字符串
  }
}

// ---- AI 分析功能 ----
/**
 * 执行 AI 深度分析
 * 1. 将当前搜索结果发送到后端 /api/analyze 接口
 * 2. 通过 SSE (Server-Sent Events) 流式接收分析结果
 * 3. 实时渲染 Markdown 格式的分析内容
 */
async function analyzeResults() {
  // 防止重复分析或无搜索结果时分析
  if (isAnalyzing || searchResults.length === 0) return;
  isAnalyzing = true;
  summaryVisible = true; // 显示分析面板

  // 获取 DOM 元素引用
  const summaryPanel = document.getElementById('summaryPanel');       // 分析面板容器
  const summaryContentEl = document.getElementById('summaryContent'); // 分析内容区域
  const analyzeBtn = document.getElementById('analyzeBtn');           // 分析按钮

  // 显示面板和加载状态
  summaryPanel.style.display = 'block';
  summaryContentEl.innerHTML = `<div class="summary-loading"><div class="pulse"></div><span>${currentLocale === 'zh' ? 'AI 正在分析...' : 'AI analyzing...'}</span></div>`;
  analyzeBtn.disabled = true; // 禁用按钮防止重复点击

  try {
    // 发送分析请求到后端 API
    const resp = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: document.getElementById('searchInput').value, // 搜索关键词
        results: searchResults.map(r => ({                   // 精简的搜索结果
          title: r.title,
          snippet: r.snippet,
          url: r.url
        })),
        locale: currentLocale                                 // 当前语言
      })
    });

    // 检查 HTTP 响应状态
    if (!resp.ok) throw new Error('Analyze failed');

    // 使用 ReadableStream 读取 SSE 流式响应
    const reader = resp.body.getReader();
    const decoder = new TextDecoder(); // 文本解码器
    summaryContent = '';               // 重置累积内容

    summaryContentEl.innerHTML = ''; // 清空加载状态

    // 循环读取流数据
    while (true) {
      const { done, value } = await reader.read();
      if (done) break; // 流结束

      // 解码二进制数据为文本
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n'); // SSE 格式按行分割

      // 解析每一行 SSE 数据
      for (const line of lines) {
        if (line.startsWith('data: ')) {          // SSE 数据行格式：data: {json}
          try {
            const data = JSON.parse(line.slice(6)); // 解析 JSON 数据
            if (data.content) {
              summaryContent += data.content;       // 累积内容
              summaryContentEl.innerHTML = renderMarkdown(summaryContent); // 渲染 Markdown
              summaryContentEl.scrollTop = summaryContentEl.scrollHeight;  // 自动滚动到底部
            }
          } catch (e) {
            // 跳过无效的 JSON 行（如心跳包等）
          }
        }
      }
    }
  } catch (error) {
    // 分析失败：显示错误提示
    summaryContentEl.innerHTML = `<div class="error-state"><p>${t('analyzeError')}</p></div>`;
  } finally {
    // 无论成功或失败，恢复按钮状态
    isAnalyzing = false;
    analyzeBtn.disabled = false;
  }
}

/**
 * 关闭 AI 分析面板
 */
function closeSummary() {
  summaryVisible = false;
  document.getElementById('summaryPanel').style.display = 'none';
}

// ---- 收藏夹视图 ----
/**
 * 渲染收藏夹列表
 * 无收藏时显示空状态提示，有收藏时渲染卡片列表
 */
function renderFavorites() {
  const resultsContainer = document.getElementById('results');
  const emptyState = document.getElementById('emptyState');
  const resultCount = document.getElementById('resultCount');

  if (favorites.length === 0) {
    // 无收藏：显示空状态
    resultsContainer.innerHTML = '';
    emptyState.style.display = 'flex';
    emptyState.querySelector('.empty-title').textContent = t('noFavorites');
    emptyState.querySelector('.empty-desc').textContent = t('noFavoritesDesc');
    resultCount.textContent = '';
    return;
  }

  // 有收藏：渲染卡片列表
  emptyState.style.display = 'none';
  resultCount.textContent = t('resultCount').replace('{count}', favorites.length);
  resultsContainer.innerHTML = '';

  favorites.forEach((result, index) => {
    const card = createResultCard(result, index); // 复用搜索结果卡片组件
    resultsContainer.appendChild(card);
  });
}

/**
 * 切换搜索视图和收藏夹视图
 */
function toggleView() {
  currentView = currentView === 'search' ? 'favorites' : 'search';
  const favToggle = document.getElementById('favToggle');
  const searchContainer = document.getElementById('searchContainer');
  const emptyState = document.getElementById('emptyState');

  if (currentView === 'favorites') {
    // 切换到收藏夹视图
    favToggle.classList.add('active');               // 高亮收藏按钮
    searchContainer.style.display = 'none';          // 隐藏搜索区
    renderFavorites();                               // 渲染收藏列表
  } else {
    // 切换回搜索视图
    favToggle.classList.remove('active');             // 取消高亮
    searchContainer.style.display = 'block';         // 显示搜索区
    if (searchResults.length === 0) {
      // 无搜索结果时恢复空状态
      emptyState.style.display = 'flex';
      emptyState.querySelector('.empty-title').textContent = t('emptyTitle');
      emptyState.querySelector('.empty-desc').textContent = t('emptyDesc');
      document.getElementById('resultCount').textContent = '';
    }
  }
}

// ---- Markdown 渲染器（简易版） ----
/**
 * 将 Markdown 文本转换为 HTML
 * 支持的语法：h1/h2/h3 标题、加粗、斜体、列表项、段落
 * @param text - Markdown 原始文本
 * @returns HTML 字符串
 */
function renderMarkdown(text) {
  return text
    .replace(/&/g, '&amp;')          // 转义 HTML 实体：&
    .replace(/</g, '&lt;')           // 转义 HTML 实体：<
    .replace(/>/g, '&gt;')           // 转义 HTML 实体：>
    .replace(/### (.+)/g, '<h4>$1</h4>')  // ### 三级标题 -> h4
    .replace(/## (.+)/g, '<h3>$1</h3>')   // ## 二级标题 -> h3
    .replace(/# (.+)/g, '<h2>$1</h2>')    // # 一级标题 -> h2
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // **加粗**
    .replace(/\*(.+?)\*/g, '<em>$1</em>')            // *斜体*
    .replace(/^- (.+)/gm, '<li>$1</li>')             // - 列表项
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')       // 包裹为 ul
    .replace(/\n\n/g, '<br><br>')  // 双换行 -> 段落间距
    .replace(/\n/g, '<br>');       // 单换行 -> br
}

// ---- 工具函数 ----
/**
 * HTML 转义：防止 XSS 攻击
 * 将特殊字符转义为 HTML 实体
 * @param str - 需要转义的字符串
 * @returns 转义后的安全字符串
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;    // textContent 自动转义 HTML
  return div.innerHTML;     // 返回转义后的 HTML
}

// ---- 分类选择 ----
/**
 * 切换搜索分类
 * 更新分类标签的 active 状态
 * @param category - 分类名称
 */
function selectCategory(category) {
  currentCategory = category; // 更新全局分类状态
  // 遍历所有分类标签，设置 active 类
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.category === category);
  });
}

// ---- 初始化 ----
/**
 * 应用初始化函数
 * 1. 加载后端配置
 * 2. 加载收藏列表
 * 3. 应用语言翻译
 * 4. 绑定事件监听器
 * 5. 聚焦搜索输入框
 */
async function init() {
  await loadConfig();   // 加载后端 API 地址
  loadFavorites();      // 加载本地收藏数据
  applyLocale();        // 应用语言翻译到页面

  // 搜索输入框引用
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  // 搜索按钮点击事件
  searchBtn.addEventListener('click', () => search(searchInput.value));
  // 输入框回车事件
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') search(searchInput.value);
  });

  // 分类标签点击事件
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => selectCategory(tab.dataset.category));
  });

  // AI 分析按钮点击事件
  document.getElementById('analyzeBtn').addEventListener('click', analyzeResults);

  // 关闭分析面板按钮
  document.getElementById('closeSummary').addEventListener('click', closeSummary);

  // 收藏夹切换按钮
  document.getElementById('favToggle').addEventListener('click', toggleView);

  // 语言切换按钮
  document.getElementById('langToggle').addEventListener('click', toggleLocale);

  // 反馈按钮：跳转支持与反馈页面
  document.getElementById('feedbackBtn').addEventListener('click', () => {
    const supportUrl = `${API_BASE}/support`;
    chrome.tabs.create({ url: supportUrl });
  });

  // 自动聚焦搜索输入框
  searchInput.focus();
}

// DOM 加载完成后初始化应用
document.addEventListener('DOMContentLoaded', init);
