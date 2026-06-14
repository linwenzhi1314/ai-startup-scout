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
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-2GN9Y1HJZG';

/**
 * GA4 组件
 * @returns Script标签用于加载 gtag.js，以及内联脚本用于初始化
 */
export function GoogleAnalytics() {
  // 判断是否为生产环境（只在生产环境启用 GA4）
  const isProduction = process.env.COZE_PROJECT_ENV === 'PROD';
  // 或者根据是否有 GA衡量ID来判断
  const shouldLoad = GA_MEASUREMENT_ID && isProduction;

  // 开发环境不加载 GA4
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
        - 初始化配置：发送 page_view 事件
      */}
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
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