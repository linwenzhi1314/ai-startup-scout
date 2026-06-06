/* ========================================
   AI Startup Scout - i18n System
   ======================================== */

const LOCALES = {
  'en': {
    // Header
    headerTitle: 'AI Startup Scout',
    favToggleTitle: 'Favorites',
    langToggleTitle: '中文',

    // Search
    searchPlaceholder: 'Search AI startups...',
    categoryAll: 'All',
    categoryFunding: 'Funding',
    categoryProduct: 'Product',
    categoryOpensource: 'Open Source',
    categoryModel: 'Model',

    // Empty state
    emptyTitle: 'Discover the next AI unicorn',
    emptyDesc: 'Enter keywords to search AI startups',

    // AI Summary
    aiInsight: 'AI Insight',
    aiAnalyze: 'AI Analyze',
    closeSummary: 'Close',

    // Results
    resultCount: '{count} results',
    noResults: 'No results found',
    noResultsDesc: 'Try different keywords or category',
    addToFav: 'Add to favorites',
    removeFromFav: 'Remove from favorites',
    viewSource: 'View source',

    // Favorites
    favoritesTitle: 'Favorites',
    noFavorites: 'No favorites yet',
    noFavoritesDesc: 'Bookmark AI startups you\'re interested in',

    // Errors
    searchError: 'Search failed, please try again',
    analyzeError: 'AI analysis failed, please try again',
    retryBtn: 'Retry',
    networkError: 'Network error, please check connection',

    // Analyze prompt context
    analyzeContext: 'Analyze the following AI startup projects, provide market insights, key recommendations, and investment advice. Respond in English.',

    // Category search keywords (used for building search queries)
    categoryKeywords: {
      all: 'AI startup',
      funding: 'AI startup funding investment',
      product: 'AI startup product launch',
      opensource: 'AI open source project',
      model: 'AI foundation model startup'
    }
  },
  'zh': {
    // Header
    headerTitle: 'AI Startup Scout',
    favToggleTitle: '收藏夹',
    langToggleTitle: 'EN',

    // Search
    searchPlaceholder: '搜索 AI 创业项目...',
    categoryAll: '全部',
    categoryFunding: '融资',
    categoryProduct: '产品',
    categoryOpensource: '开源',
    categoryModel: '模型',

    // Empty state
    emptyTitle: '发现下一个 AI 独角兽',
    emptyDesc: '输入关键词搜索 AI 创业项目',

    // AI Summary
    aiInsight: 'AI 洞察',
    aiAnalyze: 'AI 分析',
    closeSummary: '关闭',

    // Results
    resultCount: '{count} 条结果',
    noResults: '未找到相关结果',
    noResultsDesc: '试试其他关键词或分类',
    addToFav: '添加收藏',
    removeFromFav: '取消收藏',
    viewSource: '查看来源',

    // Favorites
    favoritesTitle: '收藏夹',
    noFavorites: '暂无收藏',
    noFavoritesDesc: '收藏你感兴趣的 AI 创业项目',

    // Errors
    searchError: '搜索失败，请重试',
    analyzeError: 'AI 分析失败，请重试',
    retryBtn: '重试',
    networkError: '网络错误，请检查连接',

    // Analyze prompt context
    analyzeContext: '分析以下 AI 创业项目，提供市场洞察、重点推荐项目和投资建议。请用中文回答。',

    // Category search keywords
    categoryKeywords: {
      all: 'AI创业项目',
      funding: 'AI创业融资投资',
      product: 'AI创业产品发布',
      opensource: 'AI开源项目',
      model: 'AI大模型创业'
    }
  }
};

// Detect user locale
function detectLocale() {
  // 1. Check saved preference
  const saved = localStorage.getItem('aiScoutLocale');
  if (saved && LOCALES[saved]) return saved;

  // 2. Check browser language
  const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  if (browserLang.startsWith('zh')) return 'zh';

  // 3. Default to English
  return 'en';
}

let currentLocale = detectLocale();

function t(key) {
  return LOCALES[currentLocale][key] || LOCALES['en'][key] || key;
}

function getCategoryKeyword(category) {
  const keywords = t('categoryKeywords');
  return keywords[category] || keywords['all'];
}

function toggleLocale() {
  currentLocale = currentLocale === 'en' ? 'zh' : 'en';
  localStorage.setItem('aiScoutLocale', currentLocale);
  applyLocale();
}

function applyLocale() {
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    if (text) el.textContent = text;
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const text = t(key);
    if (text) el.placeholder = text;
  });

  // Update titles
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const text = t(key);
    if (text) el.title = text;
  });

  // Update html lang
  document.documentElement.lang = currentLocale === 'zh' ? 'zh-CN' : 'en';

  // Update lang toggle button text
  const langBtn = document.getElementById('langToggle');
  if (langBtn) langBtn.textContent = t('langToggleTitle');

  // Refresh current view if needed
  if (currentView === 'favorites') {
    renderFavorites();
  }
}
