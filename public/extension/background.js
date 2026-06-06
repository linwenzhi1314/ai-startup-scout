/**
 * AI Startup Scout - Background Service Worker
 * @description Chrome 扩展的后台服务脚本（Manifest V3）。
 *              职责：
 *              1. 监听扩展安装事件
 *              2. 定时 ping 后端 API，防止沙箱环境休眠（保活机制）
 *              3. 响应来自 popup 的消息，返回 API 基地址
 */

// 后端 API 默认地址 - 部署时需要更新为实际域名
const DEFAULT_API_BASE = 'https://c4d0bc61-90f7-4fae-b79e-2daab43d84fe.dev.coze.site';

// 监听扩展安装事件：首次安装或更新时触发
chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Startup Scout installed');
});

// 保活机制：每 4 分钟 ping 一次后端配置接口
// 原因：沙箱环境在空闲超过 5 分钟后会休眠，定时请求可保持服务活跃
setInterval(() => {
  fetch(`${DEFAULT_API_BASE}/api/config`)
    .then(() => console.log('Keep-alive ping sent'))  // ping 成功
    .catch(() => {});                                  // ping 失败静默忽略
}, 4 * 60 * 1000); // 4 分钟间隔（240,000 毫秒）

// 监听来自 popup.js 的消息
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // 处理获取 API 基地址的请求
  if (message.type === 'GET_API_BASE') {
    sendResponse({ apiBase: DEFAULT_API_BASE }); // 返回后端 API 地址
  }
  // 返回 true 表示异步响应（保持消息通道开启）
  return true;
});
