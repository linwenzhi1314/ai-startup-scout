/* ========================================
   AI Startup Scout -宽屏版 Popup Logic (v1.3.3-wide)
   左右分栏布局：左侧AI分析 + 右侧搜索======================================== */

// ---- 应用状态变量 ----
let currentCategory = 'all';  // 当前选中的分类
let searchResults = [];       // 搜索结果数组
let favorites = [];           // 收藏列表数组
let isSearching = false;      // 是否正在搜索中
let isAnalyzing = false;      // 是否正在 AI 分析中
let API_BASE = '';            // 后端 API 基地址

// ---- 配置加载 ----
async function loadConfig() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);
  
  try {
    const resp = await fetch('https://ai-startup-scout.vercel.app/api/config', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (resp.ok) {
      const config = await resp.json();
      API_BASE = config.apiBase;
    }
  } catch (e) {
    clearTimeout(timeoutId);
    console.warn('Config load failed or timeout, using fallback:', e.message);
  }
  
  if (!API_BASE) {
    API_BASE = 'https://ai-startup-scout.vercel.app';
  }
}

// ---- 收藏功能 ----
function loadFavorites() {
  try {
    const data = localStorage.getItem('aiScoutFavorites');
    favorites = data ? JSON.parse(data) : [];
  } catch (e) {
    favorites = [];
  }
}

function saveFavorites() {
  localStorage.setItem('aiScoutFavorites', JSON.stringify(favorites));
}

function isFavorite(id) {
  return favorites.some(f => f.id === id);
}

function toggleFavorite(result) {
  const idx = favorites.findIndex(f => f.id === result.id);
  if (idx >= 0) {
    favorites.splice(idx, 1);
  } else {
    favorites.push({ ...result, favoritedAt: Date.now() });
  }
  saveFavorites();
}

// ---- 分类关键词映射 ----
function getCategoryKeyword(category) {
  const keywords = {
    'funding': '融资 投资',
    'product': '产品 发布',
    'opensource': '开源 GitHub',
    'model': '模型 GPT LLM'
  };
  return keywords[category] || '';
}

// ---- 搜索功能 ----
async function search(query) {
  if (isSearching || !query.trim()) return;
  isSearching = true;
  
  // GA4 埋点：搜索行为开始
  if (window.GA4Analytics) window.GA4Analytics.trackSearchPerformed(query);

  // 更新面板状态
  updatePanelStatus('等待分析');

  const resultsContainer = document.getElementById('results');
  const emptyState = document.getElementById('emptyState');
  const loadingIndicator = document.getElementById('loading');
  const resultCount = document.getElementById('resultCount');

  emptyState.style.display = 'none';
  loadingIndicator.style.display = 'flex';
  resultsContainer.innerHTML = '';
  resultCount.textContent = '';
  document.getElementById('analyzeBtn').disabled = true;

  try {
    const categoryKeyword = getCategoryKeyword(currentCategory);
    const fullQuery = `${categoryKeyword} ${query}`.trim();

    const searchController = new AbortController();
    const searchTimeoutId = setTimeout(() => searchController.abort(), 10000);
    
    const resp = await fetch(`${API_BASE}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: fullQuery,
        category: currentCategory,
        count: 6,
        locale: currentLocale
      }),
      signal: searchController.signal
    });
    clearTimeout(searchTimeoutId);

    if (!resp.ok) throw new Error('Search failed');

    const data = await resp.json();
    searchResults = data.results || [];

    if (searchResults.length === 0) {
      resultsContainer.innerHTML = `
        <div class="no-results">
          <p>${t('noResults')}</p>
        </div>`;
      document.getElementById('analyzeBtn').disabled = true;
    } else {
      resultCount.textContent = t('resultCount').replace('{count}', searchResults.length);
      searchResults.forEach((result, index) => {
        const card = createResultCard(result, index);
        resultsContainer.appendChild(card);
      });
      document.getElementById('analyzeBtn').disabled = false;
      updatePanelStatus('可分析');
      // GA4 埋点：搜索完成（成功）
      if (window.GA4Analytics) window.GA4Analytics.trackSearchCompleted(query, searchResults.length);
    }
  } catch (error) {
    resultsContainer.innerHTML = `
      <div class="error-state">
        <p>${t('searchError')}</p>
        <button class="retry-btn">${t('retryBtn')}</button>
      </div>`;
    
    const retryBtn = resultsContainer.querySelector('.retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        const query = document.getElementById('searchInput').value;
        search(query);
      });
    }
  } finally {
    loadingIndicator.style.display = 'none';
    isSearching = false;
  }
}

// ---- 创建结果卡片 ----
function createResultCard(result, index) {
  const card = document.createElement('div');
  card.className = 'result-card';
  card.style.animationDelay = `${index * 0.05}s`;

  const fav = isFavorite(result.id);

  card.innerHTML = `
    <div class="result-title">
      <a href="${result.url}" target="_blank">${escapeHtml(result.title)}</a>
      <button class="fav-btn ${fav ? 'active' : ''}" data-id="${result.id}">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="${fav ? '#F59E0B' : 'none'}" stroke="${fav ? '#F59E0B' : '#64748b'}" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    </div>
    <p class="result-snippet">${escapeHtml(result.snippet || '')}</p>`;

  // 收藏按钮事件
  card.querySelector('.fav-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(result);
    const btn = card.querySelector('.fav-btn');
    const isFav = isFavorite(result.id);
    btn.classList.toggle('active');
    btn.querySelector('svg').setAttribute('fill', isFav ? '#F59E0B' : 'none');
  });

  return card;
}

// ---- AI 分析功能 ----
async function analyzeResults() {
  if (isAnalyzing || searchResults.length === 0) return;
  isAnalyzing = true;

  // GA4 埋点：AI 分析点击
  if (window.GA4Analytics) window.GA4Analytics.trackAiAnalyzeClicked();

  const summaryContentEl = document.getElementById('summaryContent');
  const analyzeBtn = document.getElementById('analyzeBtn');

  updatePanelStatus('分析中...', 'loading');

  summaryContentEl.innerHTML = `<div class="summary-loading"><div class="pulse"></div><span>AI 正在分析...</span></div>`;
  analyzeBtn.disabled = true;

  let summaryContent = '';

  try {
    const resp = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: document.getElementById('searchInput').value,
        results: searchResults.map(r => ({
          title: r.title,
          snippet: r.snippet,
          url: r.url
        })),
        locale: currentLocale
      })
    });

    if (!resp.ok) throw new Error('Analyze failed');

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();

    summaryContentEl.innerHTML = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
              summaryContent += data.content;
              summaryContentEl.innerHTML = renderMarkdown(summaryContent);
              summaryContentEl.scrollTop = summaryContentEl.scrollHeight;
            }
          } catch (e) {}
        }
      }
    }

    updatePanelStatus('分析完成', 'active');
    // GA4 埋点：AI 分析完成
    if (window.GA4Analytics) window.GA4Analytics.trackAiAnalyzeCompleted();
  } catch (error) {
    summaryContentEl.innerHTML = `<div class="error-state"><p>${t('analyzeError')}</p></div>`;
    updatePanelStatus('分析失败');
  } finally {
    isAnalyzing = false;
    analyzeBtn.disabled = false;
  }
}

// ---- 更新面板状态 ----
function updatePanelStatus(text, state = '') {
  const statusEl = document.getElementById('panelStatus');
  statusEl.textContent = text;
  statusEl.className = 'panel-status' + (state ? ' ' + state : '');
}

// ---- Markdown渲染器 ----
function renderMarkdown(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/### (.+)/g, '<h3>$1</h3>')
    .replace(/## (.+)/g, '<h3>$1</h3>')
    .replace(/# (.+)/g, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

// ---- 工具函数 ----
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---- 分类选择 ----
function selectCategory(category) {
  currentCategory = category;
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.category === category);
  });
}

// ---- 初始化 ----
async function init() {
  // GA4 埋点：插件打开
  if (window.GA4Analytics) window.GA4Analytics.trackExtensionOpened();
  
  await loadConfig();
  loadFavorites();
  applyLocale();

  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  searchBtn.addEventListener('click', () => search(searchInput.value));
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') search(searchInput.value);
  });

  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => selectCategory(tab.dataset.category));
  });

  document.getElementById('analyzeBtn').addEventListener('click', analyzeResults);

  document.getElementById('langToggle').addEventListener('click', toggleLocale);

  document.getElementById('feedbackBtn').addEventListener('click', () => {
    const supportUrl = `${API_BASE}/support`;
    chrome.tabs.create({ url: supportUrl });
  });

  searchInput.focus();
}

document.addEventListener('DOMContentLoaded', init);