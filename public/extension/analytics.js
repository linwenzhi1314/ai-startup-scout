/**
 * GA4 Measurement Protocol 客户端
 * 用于 Chrome 扩展发送事件到 Google Analytics 4
 * 
 * Manifest V3 不允许使用远程脚本（gtag.js），因此使用 Measurement Protocol 直接发送 HTTP 请求
 */

// GA4 配置
const GA_CONFIG = {
  measurementId: 'G-7KS6RH463Y',
  apiSecret: '-2tvqhRXQfSNyfPJNQgAIw',
  endpoint: 'https://www.google-analytics.com/mp/collect'
};

/**
 * 生成随机客户端 ID
 * 用于标识用户（替代 GA4 自动生成的 client_id）
 * @returns {string} 随机 UUID 格式的客户端 ID
 */
function generateClientId() {
  // 生成类似 UUID 的格式：xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function() {
    const r = Math.random() * 16 | 0;
    return r.toString(16);
  });
}

/**
 * 获取或创建客户端 ID
 * 使用 chrome.storage.local 持久化存储
 * @returns {Promise<string>} 客户端 ID
 */
async function getClientId() {
  try {
    const result = await chrome.storage.local.get(['ga_client_id']);
    if (result.ga_client_id) {
      return result.ga_client_id;
    }
    // 生成新的客户端 ID 并存储
    const newClientId = generateClientId();
    await chrome.storage.local.set({ ga_client_id: newClientId });
    return newClientId;
  } catch (error) {
    // 如果 chrome.storage 不可用，返回临时 ID
    console.warn('GA4: chrome.storage 不可用，使用临时客户端 ID');
    return generateClientId();
  }
}

/**
 * 发送事件到 GA4 Measurement Protocol
 * @param {string} eventName - 事件名称
 * @param {Object} eventParams - 事件参数
 * @returns {Promise<boolean>} 发送是否成功
 */
async function trackEvent(eventName, eventParams = {}) {
  try {
    const clientId = await getClientId();
    
    // 构建请求体
    const requestBody = {
      client_id: clientId,
      events: [{
        name: eventName,
        params: {
          ...eventParams,
          // 添加会话相关信息
          session_id: await getSessionId(),
          engagement_time_msec: eventParams.engagement_time_msec || 100
        }
      }]
    };
    
    // 发送请求到 GA4
    const url = `${GA_CONFIG.endpoint}?measurement_id=${GA_CONFIG.measurementId}&api_secret=${GA_CONFIG.apiSecret}`;
    
    // 使用 fetch 发送（Chrome 扩展 Manifest V3 支持 fetch）
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (response.ok) {
      console.log(`GA4: 事件 "${eventName}" 发送成功`);
      return true;
    } else {
      console.warn(`GA4: 事件 "${eventName}" 发送失败，状态码: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('GA4: 发送事件失败', error);
    return false;
  }
}

/**
 * 生成随机会话 ID
 * @returns {string} 会话 ID
 */
function generateSessionId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 获取或创建会话 ID
 * 会话在 30 分钟内保持活跃
 * @returns {Promise<string>} 会话 ID
 */
async function getSessionId() {
  try {
    const result = await chrome.storage.local.get(['ga_session_id', 'ga_session_timestamp']);
    const now = Date.now();
    const sessionTimeout = 30 * 60 * 1000; // 30 分钟
    
    // 如果会话存在且未过期
    if (result.ga_session_id && result.ga_session_timestamp && (now - result.ga_session_timestamp < sessionTimeout)) {
      // 更新会话时间戳
      await chrome.storage.local.set({ ga_session_timestamp: now });
      return result.ga_session_id;
    }
    
    // 创建新会话
    const newSessionId = generateSessionId();
    await chrome.storage.local.set({ 
      ga_session_id: newSessionId,
      ga_session_timestamp: now
    });
    return newSessionId;
  } catch (error) {
    console.warn('GA4: chrome.storage 不可用，使用临时会话 ID');
    return generateSessionId();
  }
}

/**
 * 预定义事件追踪函数
 */

// 扩展打开事件
async function trackExtensionOpened() {
  return trackEvent('extension_opened', {
    source: 'popup'
  });
}

// 搜索行为事件
async function trackSearchPerformed(query) {
  return trackEvent('search_performed', {
    search_query: query,
    search_query_length: query ? query.length : 0
  });
}

// 搜索完成事件
async function trackSearchCompleted(query, resultsCount) {
  return trackEvent('search_completed', {
    search_query: query,
    results_count: resultsCount,
    has_results: resultsCount > 0
  });
}

// AI 分析点击事件
async function trackAiAnalyzeClicked(projectName) {
  return trackEvent('ai_analyze_clicked', {
    project_name: projectName
  });
}

// AI 分析完成事件
async function trackAiAnalyzeCompleted(projectName, duration) {
  return trackEvent('ai_analyze_completed', {
    project_name: projectName,
    duration_msec: duration
  });
}

// 导出函数供 popup.js 使用
window.GA4Analytics = {
  trackEvent,
  trackExtensionOpened,
  trackSearchPerformed,
  trackSearchCompleted,
  trackAiAnalyzeClicked,
  trackAiAnalyzeCompleted
};