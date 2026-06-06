/* ========================================
   AI Startup Scout - Popup Logic (v1.1.0)
   With i18n support: auto-detect locale
   ======================================== */

// ---- State ----
let currentView = 'search'; // 'search' | 'favorites'
let currentCategory = 'all';
let searchResults = [];
let favorites = [];
let summaryVisible = false;
let summaryContent = '';
let isSearching = false;
let isAnalyzing = false;
let API_BASE = '';

// ---- Config ----
async function loadConfig() {
  try {
    const resp = await fetch('https://c4d0bc61-90f7-4fae-b79e-2daab43d84fe.dev.coze.site/api/config');
    if (resp.ok) {
      const config = await resp.json();
      API_BASE = config.apiBase;
    }
  } catch (e) {
    console.warn('Failed to load config, using fallback');
  }
  if (!API_BASE) {
    API_BASE = 'https://c4d0bc61-90f7-4fae-b79e-2daab43d84fe.dev.coze.site';
  }
}

// ---- Favorites ----
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

// ---- Search ----
async function search(query) {
  if (isSearching || !query.trim()) return;
  isSearching = true;
  summaryVisible = false;
  summaryContent = '';

  const resultsContainer = document.getElementById('results');
  const emptyState = document.getElementById('emptyState');
  const loadingIndicator = document.getElementById('loading');
  const resultCount = document.getElementById('resultCount');

  emptyState.style.display = 'none';
  loadingIndicator.style.display = 'flex';
  resultsContainer.innerHTML = '';

  try {
    const categoryKeyword = getCategoryKeyword(currentCategory);
    const fullQuery = `${categoryKeyword} ${query}`.trim();

    const resp = await fetch(`${API_BASE}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: fullQuery,
        category: currentCategory,
        count: 8,
        locale: currentLocale
      })
    });

    if (!resp.ok) throw new Error('Search failed');

    const data = await resp.json();
    searchResults = data.results || [];

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
    } else {
      resultCount.textContent = t('resultCount').replace('{count}', searchResults.length);
      searchResults.forEach((result, index) => {
        const card = createResultCard(result, index);
        resultsContainer.appendChild(card);
      });
    }
  } catch (error) {
    resultsContainer.innerHTML = `
      <div class="error-state">
        <p data-i18n="searchError">${t('searchError')}</p>
        <button class="retry-btn" onclick="retrySearch()" data-i18n="retryBtn">${t('retryBtn')}</button>
      </div>`;
    resultCount.textContent = '';
  } finally {
    loadingIndicator.style.display = 'none';
    isSearching = false;
  }
}

function retrySearch() {
  const query = document.getElementById('searchInput').value;
  search(query);
}

function createResultCard(result, index) {
  const card = document.createElement('div');
  card.className = 'result-card';
  card.style.animationDelay = `${index * 0.05}s`;

  const fav = isFavorite(result.id);
  const domain = result.url ? new URL(result.url).hostname.replace('www.', '') : '';
  const publishTime = result.publishTime
    ? formatDate(result.publishTime)
    : '';

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

  // Fav button click
  card.querySelector('.fav-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(result);
    const btn = card.querySelector('.fav-btn');
    const isFav = isFavorite(result.id);
    btn.classList.toggle('active');
    btn.querySelector('svg').setAttribute('fill', isFav ? '#F59E0B' : 'none');
    btn.querySelector('svg').setAttribute('stroke', isFav ? '#F59E0B' : '#64748b');
    btn.title = isFav ? t('removeFromFav') : t('addToFav');
  });

  return card;
}

function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / 86400000);
    if (currentLocale === 'zh') {
      if (days === 0) return '今天';
      if (days === 1) return '昨天';
      if (days < 7) return `${days}天前`;
      if (days < 30) return `${Math.floor(days / 7)}周前`;
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    } else {
      if (days === 0) return 'Today';
      if (days === 1) return 'Yesterday';
      if (days < 7) return `${days}d ago`;
      if (days < 30) return `${Math.floor(days / 7)}w ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  } catch {
    return '';
  }
}

// ---- AI Analysis ----
async function analyzeResults() {
  if (isAnalyzing || searchResults.length === 0) return;
  isAnalyzing = true;
  summaryVisible = true;

  const summaryPanel = document.getElementById('summaryPanel');
  const summaryContentEl = document.getElementById('summaryContent');
  const analyzeBtn = document.getElementById('analyzeBtn');

  summaryPanel.style.display = 'block';
  summaryContentEl.innerHTML = `<div class="summary-loading"><div class="pulse"></div><span>${currentLocale === 'zh' ? 'AI 正在分析...' : 'AI analyzing...'}</span></div>`;
  analyzeBtn.disabled = true;

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
    summaryContent = '';

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
          } catch (e) {
            // skip invalid JSON
          }
        }
      }
    }
  } catch (error) {
    summaryContentEl.innerHTML = `<div class="error-state"><p>${t('analyzeError')}</p></div>`;
  } finally {
    isAnalyzing = false;
    analyzeBtn.disabled = false;
  }
}

function closeSummary() {
  summaryVisible = false;
  document.getElementById('summaryPanel').style.display = 'none';
}

// ---- Favorites View ----
function renderFavorites() {
  const resultsContainer = document.getElementById('results');
  const emptyState = document.getElementById('emptyState');
  const resultCount = document.getElementById('resultCount');

  if (favorites.length === 0) {
    resultsContainer.innerHTML = '';
    emptyState.style.display = 'flex';
    emptyState.querySelector('.empty-title').textContent = t('noFavorites');
    emptyState.querySelector('.empty-desc').textContent = t('noFavoritesDesc');
    resultCount.textContent = '';
    return;
  }

  emptyState.style.display = 'none';
  resultCount.textContent = t('resultCount').replace('{count}', favorites.length);
  resultsContainer.innerHTML = '';

  favorites.forEach((result, index) => {
    const card = createResultCard(result, index);
    resultsContainer.appendChild(card);
  });
}

function toggleView() {
  currentView = currentView === 'search' ? 'favorites' : 'search';
  const favToggle = document.getElementById('favToggle');
  const searchContainer = document.getElementById('searchContainer');
  const emptyState = document.getElementById('emptyState');

  if (currentView === 'favorites') {
    favToggle.classList.add('active');
    searchContainer.style.display = 'none';
    renderFavorites();
  } else {
    favToggle.classList.remove('active');
    searchContainer.style.display = 'block';
    if (searchResults.length === 0) {
      emptyState.style.display = 'flex';
      emptyState.querySelector('.empty-title').textContent = t('emptyTitle');
      emptyState.querySelector('.empty-desc').textContent = t('emptyDesc');
      document.getElementById('resultCount').textContent = '';
    }
  }
}

// ---- Markdown Renderer (simple) ----
function renderMarkdown(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/### (.+)/g, '<h4>$1</h4>')
    .replace(/## (.+)/g, '<h3>$1</h3>')
    .replace(/# (.+)/g, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

// ---- Utility ----
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---- Category Selection ----
function selectCategory(category) {
  currentCategory = category;
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.category === category);
  });
}

// ---- Init ----
async function init() {
  await loadConfig();
  loadFavorites();
  applyLocale();

  // Search input
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  searchBtn.addEventListener('click', () => search(searchInput.value));
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') search(searchInput.value);
  });

  // Category tabs
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => selectCategory(tab.dataset.category));
  });

  // Analyze button
  document.getElementById('analyzeBtn').addEventListener('click', analyzeResults);

  // Close summary
  document.getElementById('closeSummary').addEventListener('click', closeSummary);

  // Favorite toggle
  document.getElementById('favToggle').addEventListener('click', toggleView);

  // Language toggle
  document.getElementById('langToggle').addEventListener('click', toggleLocale);

  // Focus search
  searchInput.focus();
}

document.addEventListener('DOMContentLoaded', init);
