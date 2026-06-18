/**
 * @file 根布局组件
 * @description Next.js App Router 的根布局，定义全局 HTML 结构、元数据和字体。
 *              在开发环境下加载 React Inspector 用于代码定位调试。
 */

// 导入 Next.js 元数据类型
import type { Metadata } from 'next';
// 导入 React 开发检查器（仅开发环境使用）
import { Inspector } from 'react-dev-inspector';
// 导入GA4 Google Analytics 组件
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
// 导入 Cookie 同意弹窗组件（GDPR合规）
import { CookieConsent } from '@/components/CookieConsent';
// 导入全局样式
import './globals.css';

/**
 * 页面元数据配置
 * - title: 默认标题 + 模板标题（子页面可通过 metadata 覆盖）
 * - description: SEO 描述
 * - keywords: 搜索关键词
 * - authors: 作者信息
 */
export const metadata: Metadata = {
  title: {
    default: 'AI Startup Scout - AI创业项目搜索',   // 默认页面标题
    template: '%s | AI Startup Scout',               // 子页面标题模板
  },
  description:
    '智能搜索AI软件创业项目，获取市场洞察与投资分析。Chrome浏览器扩展，一站式发现AI创业机会。',
  keywords: [
    'AI创业',
    'AI startup',
    '创业项目搜索',
    'AI投资',
    'Chrome扩展',
    'AI工具',
    '创业雷达',
  ],
  authors: [{ name: 'AI Startup Scout' }],
};

/**
 * 根布局组件
 * @param children - 子页面内容（由 Next.js App Router 自动注入）
 * @returns HTML 根结构
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 判断当前是否为开发环境
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    // HTML 根元素，默认英文语言
    <html lang="en">
      {/* body: 抗锯齿字体渲染 */}
      <body className={`antialiased`}>
        {/* GA4 Google Analytics 跟踪（仅生产环境加载）*/}
        <GoogleAnalytics />
        {/* Cookie 同意弹窗（GDPR合规）*/}
        <CookieConsent />
        {/* 开发环境加载 React Inspector，用于点击页面元素定位源码 */}
        {isDev && <Inspector />}
        {/* 子页面内容插槽 */}
        {children}
      </body>
    </html>
  );
}
