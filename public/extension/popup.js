/**
 * AI Startup Scout - Popup Script
 * Chrome Extension for searching AI startup projects
 */

// Configuration - API base URL
// Default: placeholder that will be resolved via config API
// When publishing, update this to your actual deployed backend URL
let API_BASE = 'https://PLACEHOLDER.update-before-publish.com';

// Resolve API base from config endpoint
async function getApiBase() {
  // If already resolved to a real URL, return it
  if (API_BASE && !API_BASE.includes('PLACEHOLDER')) {
    return API_BASE;
  }
  // Try known backend domains
  const candidates = [
    'https://c4d0bc61-90f7-4fae-b79e-2daab43d84fe.dev.coze.site',
  ];
  for (const url of candidates) {
    try {
      const response = await fetch(`${url}/api/config`, { signal: AbortSignal.timeout(3000) });
      if (response.ok) {
        const data = await response.json();
        if (data.apiBase) {
          API_BASE = data.apiBase;
          return API_BASE;
        }
      }
    } catch {
      // Try next candidate
    }
  }
  return API_BASE;
}

// State
let currentCategory = 'all';
let currentQuery = '';
let searchResults = [];
let favorites = [];
let showFavorites = false;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const emptyState = document.getElementById('emptyState');
const loadingState = document.getElementById('loadingState');
const resultsList = document.getElementById('resultsList');
const favoritesList = document.getElementById('favoritesList');
const resultsArea = document.getElementById('resultsArea');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultCount = document.getElementById('resultCount');
const summarySection = document.getElementById('summarySection');
const summaryContent = document.getElementById('summaryContent');
const closeSummary = document.getElementById('closeSummary');
const favToggle = document.getElementById('favToggle');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadFavorites();
  getApiBase();
  bindEvents();
});

function bindEvents() {
  // Search
  searchBtn.addEventListener('click', doSearch);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });

  // Category tabs
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelector('.tab.active').classList.remove('active');
      tab.classList.add('active');
      currentCategory = tab.dataset.category;
      if (currentQuery) doSearch();
    });
  });

  // Favorites toggle
  favToggle.addEventListener('click', toggleFavorites);

  // Analyze
  analyzeBtn.addEventListener('click', doAnalyze);

  // Close summary
  closeSummary.addEventListener('click', () => {
    summarySection.style.display = 'none';
  });
}

// Search
async function doSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  currentQuery = query;
  showFavorites = false;
  favToggle.classList.remove('active');
  favoritesList.style.display = 'none';

  // Show loading
  emptyState.style.display = 'none';
  resultsList.style.display = 'none';
  loadingState.style.display = 'flex';
  summarySection.style.display = 'none';
  analyzeBtn.style.display = 'none';

  try {
    const base = await getApiBase();
    const response = await fetch(`${base}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        category: currentCategory,
        count: 10,
      }),
    });

    const data = await response.json();

    if (data.success) {
      searchResults = data.results || [];
      renderResults(searchResults, data.summary);
      analyzeBtn.style.display = 'flex';
      resultCount.textContent = `${searchResults.length} 条结果`;
    } else {
      showError(data.error || '搜索失败');
    }
  } catch (error) {
    console.error('Search error:', error);
    showError('网络错误，请检查连接');
  } finally {
    loadingState.style.display = 'none';
  }
}

function renderResults(results, summary) {
  resultsList.innerHTML = '';
  resultsList.style.display = 'block';
  emptyState.style.display = 'none';

  if (results.length === 0) {
    resultsList.innerHTML = `
      <div class="empty-state">
        <p class="empty-title">没有找到相关结果</p>
        <p class="empty-desc">换个关键词试试？</p>
      </div>`;
    return;
  }

  results.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.style.animationDelay = `${index * 0.05}s`;

    const isFav = favorites.some((f) => f.id === item.id);

    card.innerHTML = `
      <div class="result-card-header">
        <div class="result-title">${escapeHtml(item.title)}</div>
        <button class="fav-btn ${isFav ? 'favorited' : ''}" data-id="${item.id}" title="收藏">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div class="result-snippet">${escapeHtml(item.snippet)}</div>
      <div class="result-meta">
        <span class="result-source">
          ${item.logoUrl ? `<img src="${item.logoUrl}" width="12" height="12" style="border-radius:2px;" onerror="this.style.display='none'">` : ''}
          ${escapeHtml(item.siteName || '')}
        </span>
        ${item.publishTime ? `<span>${item.publishTime.slice(0, 10)}</span>` : ''}
      </div>
    `;

    // Click to open URL
    card.addEventListener('click', (e) => {
      if (e.target.closest('.fav-btn')) return;
      if (item.url) {
        chrome.tabs.create({ url: item.url });
      }
    });

    // Favorite button
    const favBtn = card.querySelector('.fav-btn');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(item, favBtn);
    });

    resultsList.appendChild(card);
  });
}

// AI Analysis
async function doAnalyze() {
  if (!currentQuery || searchResults.length === 0) return;

  summarySection.style.display = 'block';
  summaryContent.innerHTML = `
    <div class="analyzing-indicator">
      <span>AI 正在分析中</span>
      <div class="analyzing-dots">
        <span></span><span></span><span></span>
      </div>
    </div>`;

  analyzeBtn.disabled = true;

  try {
    const base = await getApiBase();
    const response = await fetch(`${base}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: currentQuery,
        results: searchResults,
      }),
    });

    if (!response.ok) {
      throw new Error('分析请求失败');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = '';

    summaryContent.innerHTML = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      const lines = text.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              accumulated += parsed.content;
              summaryContent.innerHTML = markdownToHtml(accumulated);
              summarySection.scrollTop = summarySection.scrollHeight;
            }
            if (parsed.error) {
              summaryContent.innerHTML = `<p style="color: #EF4444;">${parsed.error}</p>`;
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }
  } catch (error) {
    console.error('Analyze error:', error);
    summaryContent.innerHTML =
      '<p style="color: #EF4444;">分析失败，请稍后重试</p>';
  } finally {
    analyzeBtn.disabled = false;
  }
}

// Simple markdown to HTML converter
function markdownToHtml(md) {
  return md
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '<br>')
    .replace(/\n/g, '<br>');
}

// Favorites
function loadFavorites() {
  try {
    const stored = localStorage.getItem('ai_scout_favorites');
    favorites = stored ? JSON.parse(stored) : [];
  } catch {
    favorites = [];
  }
}

function saveFavorites() {
  try {
    localStorage.setItem('ai_scout_favorites', JSON.stringify(favorites));
  } catch {
    // Storage full or unavailable
  }
}

function toggleFavorite(item, btn) {
  const index = favorites.findIndex((f) => f.id === item.id);
  if (index >= 0) {
    favorites.splice(index, 1);
    btn.classList.remove('favorited');
    btn.querySelector('svg').setAttribute('fill', 'none');
  } else {
    favorites.push(item);
    btn.classList.add('favorited');
    btn.querySelector('svg').setAttribute('fill', 'currentColor');
  }
  saveFavorites();
}

function toggleFavorites() {
  showFavorites = !showFavorites;
  favToggle.classList.toggle('active', showFavorites);

  if (showFavorites) {
    resultsList.style.display = 'none';
    emptyState.style.display = 'none';
    loadingState.style.display = 'none';
    summarySection.style.display = 'none';
    analyzeBtn.style.display = 'none';
    favoritesList.style.display = 'block';
    renderFavorites();
  } else {
    favoritesList.style.display = 'none';
    if (searchResults.length > 0) {
      resultsList.style.display = 'block';
      analyzeBtn.style.display = 'flex';
    } else {
      emptyState.style.display = 'flex';
    }
  }
}

function renderFavorites() {
  favoritesList.innerHTML = '';

  if (favorites.length === 0) {
    favoritesList.innerHTML = `
      <div class="fav-empty">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        <p>暂无收藏项目</p>
      </div>`;
    return;
  }

  favorites.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'fav-card';

    card.innerHTML = `
      <div class="fav-card-content">
        <div class="fav-card-title">${escapeHtml(item.title)}</div>
        <div class="fav-card-snippet">${escapeHtml(item.snippet)}</div>
      </div>
      <button class="fav-remove-btn" data-id="${item.id}" title="移除">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    `;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.fav-remove-btn')) return;
      if (item.url) {
        chrome.tabs.create({ url: item.url });
      }
    });

    card.querySelector('.fav-remove-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = favorites.findIndex((f) => f.id === item.id);
      if (idx >= 0) {
        favorites.splice(idx, 1);
        saveFavorites();
        renderFavorites();
      }
    });

    favoritesList.appendChild(card);
  });
}

function showError(message) {
  resultsList.style.display = 'none';
  loadingState.style.display = 'none';
  emptyState.style.display = 'none';

  const errDiv = document.createElement('div');
  errDiv.className = 'error-state';
  errDiv.innerHTML = `
    <p>${escapeHtml(message)}</p>
    <button class="retry-btn">重试</button>
  `;
  errDiv.querySelector('.retry-btn').addEventListener('click', doSearch);
  resultsArea.appendChild(errDiv);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
