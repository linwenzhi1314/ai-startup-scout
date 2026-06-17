/**
 * AI Startup Scout - 国际化 (i18n) 系统
 * @description 提供中英双语翻译支持，自动检测用户浏览器语言，
 *              支持运行时切换语言，动态更新页面文案。
 * 
 * 核心 API：
 * - detectLocale()   : 检测用户语言偏好
 * - t(key)           : 根据当前语言获取翻译文本
 * - getCategoryKeyword(category) : 获取分类搜索关键词
 * - toggleLocale()   : 切换中/英文
 * - applyLocale()    : 将翻译应用到所有 DOM 元素
 */

/**
 * 翻译字典：包含英文 (en) 和中文 (zh) 两种语言的完整翻译
 * 键名按功能模块分组：Header / Search / Empty State / AI Summary / Results / Favorites / Errors
 */
const LOCALES = {
  'en': {
    // ---- 顶栏 ----
    headerTitle: 'AI Startup Scout',   // 扩展名称（不翻译）
    favToggleTitle: 'Favorites',       // 收藏夹按钮提示
    langToggleTitle: '中文',           // 语言切换按钮显示文本（切换目标语言）

    // ---- 搜索区 ----
    searchPlaceholder: 'Search AI startups...',    // 搜索输入框占位文本
    searching: 'Searching...',                     // 搜索中提示
    searchBtn: 'Search',                           // 搜索按钮提示
    categoryAll: 'All',                            // 全部分类标签
    categoryFunding: 'Funding',                    // 融资分类标签
    categoryProduct: 'Product',                    // 产品分类标签
    categoryOpensource: 'Open Source',             // 开源分类标签
    categoryModel: 'Model',                        // 模型分类标签

    // ---- 空状态 ----
    emptyTitle: 'Discover the next AI unicorn',         // 空状态主标题
    emptyDesc: 'Enter keywords to search AI startups',  // 空状态副标题

    // ---- AI 分析 ----
    aiInsight: 'AI Insight',          // AI 洞察面板标题
    aiAnalyze: 'AI Analyze',          // AI 分析按钮文本
    closeSummary: 'Close',            // 关闭分析面板按钮
    feedback: 'Feedback',             // 反馈按钮文本
    feedbackBtn: 'Feedback',          // 反馈按钮提示
    panelStatusWaiting: 'Waiting for analysis',  // 面板状态：等待分析
    summaryPlaceholder: 'Search and click "AI Analyze"',  // 分析提示
    summaryHint: 'Get deep insights report',     // 分析副提示

    // ---- 搜索结果 ----
    resultCount: '{count} results',                                     // 结果计数文本
    noResults: 'No results found',                                      // 无结果提示
    noResultsDesc: 'Try different keywords or category',                // 无结果建议
    addToFav: 'Add to favorites',                                       // 添加收藏提示
    removeFromFav: 'Remove from favorites',                             // 取消收藏提示
    viewSource: 'View source',                                          // 查看来源提示

    // ---- 收藏夹 ----
    favoritesTitle: 'Favorites',                                  // 收藏夹标题
    noFavorites: 'No favorites yet',                              // 无收藏提示
    noFavoritesDesc: 'Bookmark AI startups you\'re interested in', // 无收藏建议

    // ---- 错误提示 ----
    searchError: 'Search failed, please try again',         // 搜索失败
    analyzeError: 'AI analysis failed, please try again',   // 分析失败
    retryBtn: 'Retry',                                       // 重试按钮
    networkError: 'Network error, please check connection', // 网络错误

    // ---- AI 分析上下文提示词 ----
    analyzeContext: 'Analyze the following AI startup projects, provide market insights, key recommendations, and investment advice. Respond in English.',

    // ---- 分类搜索关键词（用于构建搜索查询） ----
    categoryKeywords: {
      all: 'AI startup',                             // 全部：通用搜索词
      funding: 'AI startup funding investment',       // 融资：融资投资搜索词
      product: 'AI startup product launch',           // 产品：产品发布搜索词
      opensource: 'AI open source project',           // 开源：开源项目搜索词
      model: 'AI foundation model startup'            // 模型：基础模型搜索词
    }
  },
  'zh': {
    // ---- 顶栏 ----
    headerTitle: 'AI Startup Scout',
    favToggleTitle: '收藏夹',
    langToggleTitle: 'EN',             // 切换目标语言为英文

    // ---- 搜索区 ----
    searchPlaceholder: '搜索 AI 创业项目...',
    searching: '搜索中...',
    searchBtn: '搜索',
    categoryAll: '全部',
    categoryFunding: '融资',
    categoryProduct: '产品',
    categoryOpensource: '开源',
    categoryModel: '模型',

    // ---- 空状态 ----
    emptyTitle: '发现下一个 AI 独角兽',
    emptyDesc: '输入关键词搜索 AI 创业项目',

    // ---- AI 分析 ----
    aiInsight: 'AI 洞察',
    aiAnalyze: 'AI 分析',
    closeSummary: '关闭',
    feedback: '反馈',
    feedbackBtn: '支持与反馈',
    panelStatusWaiting: '等待分析',
    summaryPlaceholder: '搜索后点击"AI分析"',
    summaryHint: '获取深度洞察报告',

    // ---- 搜索结果 ----
    resultCount: '{count} 条结果',
    noResults: '未找到相关结果',
    noResultsDesc: '试试其他关键词或分类',
    addToFav: '添加收藏',
    removeFromFav: '取消收藏',
    viewSource: '查看来源',

    // ---- 收藏夹 ----
    favoritesTitle: '收藏夹',
    noFavorites: '暂无收藏',
    noFavoritesDesc: '收藏你感兴趣的 AI 创业项目',

    // ---- 错误提示 ----
    searchError: '搜索失败，请重试',
    analyzeError: 'AI 分析失败，请重试',
    retryBtn: '重试',
    networkError: '网络错误，请检查连接',

    // ---- AI 分析上下文提示词 ----
    analyzeContext: '分析以下 AI 创业项目，提供市场洞察、重点推荐项目和投资建议。请用中文回答。',

    // ---- 分类搜索关键词 ----
    categoryKeywords: {
      all: 'AI创业项目',
      funding: 'AI创业融资投资',
      product: 'AI创业产品发布',
      opensource: 'AI开源项目',
      model: 'AI大模型创业'
    }
  }
};

/**
 * 检测用户语言偏好
 * 优先级：本地存储 > 浏览器语言 > 默认英文
 * @returns 语言代码 'en' 或 'zh'
 */
function detectLocale() {
  // 1. 检查用户之前保存的语言偏好
  const saved = localStorage.getItem('aiScoutLocale');
  if (saved && LOCALES[saved]) return saved;

  // 2. 检测浏览器语言设置
  const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  if (browserLang.startsWith('zh')) return 'zh'; // 中文环境

  // 3. 默认英文
  return 'en';
}

// 当前语言状态，初始化时自动检测
let currentLocale = detectLocale();

/**
 * 翻译函数：根据 key 获取当前语言的翻译文本
 * @param key - 翻译键名，对应 LOCALES 中的字段名
 * @returns 翻译后的文本，找不到时回退到英文，再找不到返回 key 本身
 */
function t(key) {
  return LOCALES[currentLocale][key] || LOCALES['en'][key] || key;
}

/**
 * 获取指定分类的搜索关键词
 * @param category - 分类名称，如 'funding'、'product'
 * @returns 当前语言下该分类的搜索关键词
 */
function getCategoryKeyword(category) {
  const keywords = t('categoryKeywords');
  return keywords[category] || keywords['all']; // 找不到时回退到"全部"分类
}

/**
 * 切换语言：在中英文之间切换
 * 切换后保存偏好到 localStorage，并刷新页面文案
 */
function toggleLocale() {
  // 在 'en' 和 'zh' 之间切换
  currentLocale = currentLocale === 'en' ? 'zh' : 'en';
  // 持久化语言偏好
  localStorage.setItem('aiScoutLocale', currentLocale);
  // 应用翻译到所有 DOM 元素
  applyLocale();
  // 如果有搜索关键词，自动重新搜索以获取对应语言的结果
  const searchInput = document.getElementById('searchInput');
  if (searchInput && searchInput.value.trim()) {
    // 触发搜索（popup.js 中的 search 函数会读取最新的 currentLocale）
    if (typeof search === 'function') {
      search(searchInput.value.trim());
    }
  }
}

/**
 * 将当前语言的翻译应用到页面上所有带 data-i18n 属性的元素
 * 支持三种属性：
 * - data-i18n: 替换元素文本内容
 * - data-i18n-placeholder: 替换输入框占位文本
 * - data-i18n-title: 替换元素 title 属性
 */
function applyLocale() {
  // 更新所有 data-i18n 元素的文本内容
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');  // 获取翻译键名
    const text = t(key);                       // 获取翻译文本
    if (text) el.textContent = text;           // 更新文本
  });

  // 更新所有输入框的占位文本
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const text = t(key);
    if (text) el.placeholder = text;
  });

  // 更新所有元素的 title 属性（鼠标悬停提示）
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const text = t(key);
    if (text) el.title = text;
  });

  // 更新 HTML 根元素的 lang 属性
  document.documentElement.lang = currentLocale === 'zh' ? 'zh-CN' : 'en';

  // 更新语言切换按钮的显示文本（只更新 lang-label，不清掉 SVG 图标）
  const langLabel = document.querySelector('.lang-label');
  if (langLabel) langLabel.textContent = currentLocale === 'zh' ? 'EN' : '中文';

  // 更新语言切换按钮的 title 提示
  const langToggleBtn = document.getElementById('langToggle');
  if (langToggleBtn) langToggleBtn.title = currentLocale === 'zh' ? 'Switch to English' : '切换到中文';

  // 如果当前在收藏夹视图，重新渲染以应用翻译（popup.js 加载后 currentView 才有定义）
  if (typeof currentView !== 'undefined' && currentView === 'favorites' && typeof renderFavorites === 'function') {
    renderFavorites();
  }
}
