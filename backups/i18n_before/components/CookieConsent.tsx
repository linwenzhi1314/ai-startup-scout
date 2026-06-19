/**
 * @file Cookie 同意弹窗组件
 * @description 用于GDPR合规，在用户首次访问时显示Cookie同意弹窗。
 *              - 用户点击「接受」：启用完整GA4追踪
 *              - 用户点击「拒绝」：仅启用基础统计或禁用追踪
 *              - 选择保存到 localStorage，下次访问不再弹窗
 */

'use client';

import { useState, useEffect } from 'react';

//localStorage 存储键名
const CONSENT_KEY = 'cookie_consent';

//同意状态类型
type ConsentStatus = 'accepted' | 'rejected' | 'pending';

/**
 * Cookie 同意弹窗组件
 * @returns Cookie同意弹窗UI，用户选择后自动隐藏
 */
export function CookieConsent() {
  // 同意状态：pending 表示未选择，需要显示弹窗
  const [consent, setConsent] = useState<ConsentStatus>('pending');
  // 是否已从 localStorage 读取完成（避免 SSR hydration 问题）
  const [isLoaded, setIsLoaded] = useState(false);

  //组件挂载后从 localStorage读取已有同意状态
  useEffect(() => {
    const savedConsent = localStorage.getItem(CONSENT_KEY) as ConsentStatus | null;
    if (savedConsent === 'accepted' || savedConsent === 'rejected') {
      setConsent(savedConsent);
      // 如果已有同意状态，同步到 gtag
      updateGtagConsent(savedConsent);
    }
    setIsLoaded(true);
  }, []);

  /**
   * 更新 gtag 意见征求模式参数
   * @param status - 同意状态
   */
  const updateGtagConsent = (status: ConsentStatus) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      if (status === 'accepted') {
        // 用户同意：启用所有追踪功能
        window.gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        });
      } else if (status === 'rejected') {
        // 用户拒绝：禁用广告追踪，仅保留基础统计
        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
      }
    }
  };

  /**
   * 处理用户点击「接受」
   */
  const handleAccept = () => {
    setConsent('accepted');
    localStorage.setItem(CONSENT_KEY, 'accepted');
    updateGtagConsent('accepted');
  };

  /**
   * 处理用户点击「拒绝」
   */
  const handleReject = () => {
    setConsent('rejected');
    localStorage.setItem(CONSENT_KEY, 'rejected');
    updateGtagConsent('rejected');
  };

  // 未加载完成时不渲染（避免 hydration 问题）
  if (!isLoaded) {
    return null;
  }

  // 已选择同意/拒绝，不再显示弹窗
  if (consent !== 'pending') {
    return null;
  }

  // 渲染 Cookie 同意弹窗
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4animate-fade-in-up">
      <div className="max-w-md mx-auto bg-[#1A1D27] border border-[#2D3348] rounded-lg shadow-lg p-4">
        {/*弹窗内容 */}
        <div className="flex items-start gap-3">
          {/*Cookie图标 */}
          <div className="text-2xl">🍪</div>
          {/*说明文字 */}
          <div className="flex-1">
            <p className="text-sm text-slate-200 mb-1">
              我们使用 Cookie 来改善您的体验
            </p>
            <p className="text-xs text-slate-400">
              我们使用 Google Analytics 来了解用户如何使用本网站。
              您可以选择接受或拒绝数据收集。
            </p>
          </div>
        </div>

        {/*按钮区域 */}
        <div className="flex gap-3 mt-4 justify-end">
          {/*拒绝按钮 */}
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 
                       border border-slate-600 rounded-md hover:border-slate-500
                       transition-colors duration-200"
          >
            拒绝
          </button>
          {/*接受按钮 */}
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm text-white 
                       bg-[#6366F1] hover:bg-[#5558E8] rounded-md
                       transition-colors duration-200"
          >
            接受
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 获取当前同意状态（供其他组件调用）
 * @returns 同意状态：'accepted' | 'rejected' | 'pending'
 */
export function getConsentStatus(): ConsentStatus {
  if (typeof window === 'undefined') {
    return 'pending';
  }
  return (localStorage.getItem(CONSENT_KEY) as ConsentStatus) || 'pending';
}