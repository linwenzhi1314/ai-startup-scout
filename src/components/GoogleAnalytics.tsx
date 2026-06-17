/**
 * @file GA4 Google Analytics 组件
 * @description 用于在 Next.js 应用中加载 Google Analytics 4 (GA4) 跟踪代码。
 *              - 生产环境：加载 gtag.js 并初始化跟踪
 *              - 开发环境：不加载，避免污染测试数据
 *              使用 Next.js 的 Script 组件优化加载策略（afterInteractive）。
 */

'use client';

//导入 Next.js Script 组件，用于优化第三方脚本加载
import Script from 'next/script';

// GA4 衡量ID，从环境变量读取（生产环境设置）
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-7KS6RH463Y';

/**
 * GA4 组件
 * @returns Script标签用于加载 gtag.js，以及内联脚本用于初始化
 */
export function GoogleAnalytics() {
  // 判断是否为生产环境
  // - 沙箱环境：COZE_PROJECT_ENV === 'PROD'
  // - Vercel/其他环境：NODE_ENV === 'production'
  const isSandboxProd = process.env.COZE_PROJECT_ENV === 'PROD';
  const isVercelProd = process.env.NODE_ENV === 'production';
  const isProduction = isSandboxProd || isVercelProd;

  // 有 GA衡量ID 且是生产环境时才加载
  const shouldLoad = GA_MEASUREMENT_ID && isProduction;

  // 非生产环境不加载 GA4（避免污染测试数据）
  if (!shouldLoad) {
    return null;
  }

  return (
    <>
      {/* 
        Google Analytics gtag.js 脚本
        - src: Google官方 CDN 地址
        - strategy: 'afterInteractive' 表示页面可交互后加载，不影响首屏性能
      */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />

      {/* 
        gtag 初始化内联脚本
        - 定义 window.dataLayer 数组用于存储事件
        - 定义 gtag 函数用于发送事件
        - 初始化意见征求模式：默认拒绝，等待用户同意后更新
        - 初始化配置：发送 page_view 事件
      */}
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          // 初始化意见征求模式：默认拒绝，等待 CookieConsent 组件更新
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500// 等待500ms 让 CookieConsent 更新状态
          });
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href
          });
        `}
      </Script>
    </>
  );
}

/**
 * gtag事件发送函数（供其他组件调用）
 * @param eventName - 事件名称（如 'click_download', 'search' 等）
 * @param eventParams - 事件参数（可选，如 { button_name: 'install' }）
 */
export function trackEvent(eventName: string, eventParams?: Record<string, unknown>) {
  // 确保 gtag 函数存在（页面已加载 gtag.js）
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams || {});
  }
}

/**
 * 扩展全局 Window 类型，添加 gtag 和 dataLayer 属性
 */
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}