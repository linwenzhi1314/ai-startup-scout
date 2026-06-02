/**
 * AI Startup Scout - Background Service Worker
 */

// Default backend URL - update this when deploying
const DEFAULT_API_BASE = 'https://c4d0bc61-90f7-4fae-b79e-2daab43d84fe.dev.coze.site';

// Listen for extension install
chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Startup Scout installed');
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_API_BASE') {
    sendResponse({ apiBase: DEFAULT_API_BASE });
  }
  return true;
});
