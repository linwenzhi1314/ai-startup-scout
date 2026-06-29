'use client';

import Link from 'next/link';
import { Locale } from '@/lib/i18n/translations';
import { useManagedContent } from '@/hooks/useManagedContent';

interface PrivacyPageContentProps {
  locale: Locale;
}

interface PrivacySection {
  title: string;
  content: string[];
}

interface PrivacyData {
  title: string;
  lastUpdated: string;
  sections: PrivacySection[];
}

export default function PrivacyPageContent({ locale }: PrivacyPageContentProps) {
  const basePath = locale === 'zh-Hans' ? '/zh-Hans' : '/en';
  const { data: privacyData } = useManagedContent<PrivacyData>('privacy', locale, {
    title: locale === 'zh-Hans' ? '隐私政策' : 'Privacy Policy',
    lastUpdated: locale === 'zh-Hans' ? '2026年6月3日' : 'June 3, 2026',
    sections: locale === 'zh-Hans' ? [
      { title: '1. 介绍', content: ['AI Startup Scout 致力于保护您的隐私。本隐私政策说明了您在使用我们的 Chrome 浏览器扩展时，我们如何处理数据。'] },
      { title: '2. 我们收集的数据', content: ['我们不会收集、存储或传输任何个人信息。'] },
      { title: '3. 本地存储', content: ['本扩展使用 chrome.storage.local 在您的设备上保存收藏的项目。此数据仅存储在您的设备上，绝不会传输到我们的服务器。'] },
      { title: '4. 搜索查询', content: ['您的搜索查询会发送到后端 API 获取结果，处理后不会在服务器上存储或记录。'] },
      { title: '5. 第三方服务', content: ['本扩展使用后端 API 提供搜索和 AI 分析功能，不会从扩展接收任何个人信息。'] },
      { title: '6. 儿童隐私', content: ['本扩展不会故意收集 13 岁以下儿童的信息。'] },
      { title: '7. 政策变更', content: ['我们可能会不时更新本隐私政策。任何变更将在此页面上以更新日期的形式体现。'] },
      { title: '8. 联系方式', content: ['如果您对本隐私政策有疑问，请通过我们的支持与反馈页面联系我们。'] },
    ] : [
      { title: '1. Introduction', content: ['AI Startup Scout is committed to protecting your privacy. This policy explains how we handle data when you use our Chrome extension.'] },
      { title: '2. Data We Collect', content: ['We do not collect, store, or transmit any personal information.'] },
      { title: '3. Local Storage', content: ['The extension uses chrome.storage.local to save bookmarked projects on your device. This data stays on your device and is never transmitted to our servers.'] },
      { title: '4. Search Queries', content: ['Your search queries are sent to our backend API and are not stored or logged after processing.'] },
      { title: '5. Third-Party Services', content: ['The extension uses backend APIs for search and AI analysis, and does not send any personal information from the extension.'] },
      { title: '6. Children\'s Privacy', content: ['We do not knowingly collect information from children under 13.'] },
      { title: '7. Policy Changes', content: ['We may update this privacy policy from time to time. Changes will be reflected by an updated date on this page.'] },
      { title: '8. Contact', content: ['If you have questions about this privacy policy, please contact us through our Support & Feedback page.'] },
    ]
  });

  return (
    <article className="min-h-screen bg-[#0F1117] text-[#F1F5F9]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-[#0F1117]/80 backdrop-blur-md border-b border-[#2D3348] z-50">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href={basePath} className="text-xl font-bold text-[#F1F5F9]">
              AI Startup Scout
            </Link>
            <Link href={basePath} className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors">
              {locale === 'zh-Hans' ? '返回首页' : 'Back to Home'}
            </Link>
          </div>
        </header>

        <div className="pt-16">
          <h1 className="text-3xl font-bold mb-2 text-white">{privacyData.title}</h1>
          <p className="text-slate-400 text-sm mb-10">
            {locale === 'zh-Hans' ? `最后更新：${privacyData.lastUpdated}` : `Last updated: ${privacyData.lastUpdated}`}
          </p>

          {privacyData.sections.map((section, index) => (
            <section key={index} className="mb-8">
              <h2 className="text-xl font-semibold text-[#6366F1] mb-3">{section.title}</h2>
              {section.content.map((paragraph, pIndex) => (
                <p key={pIndex} className="text-slate-300 leading-relaxed">{paragraph}</p>
              ))}
              {index === privacyData.sections.length - 1 && (
                <Link href={`${basePath}/support`} className="text-[#6366F1] hover:underline mt-2 inline-block">
                  {locale === 'zh-Hans' ? '支持与反馈' : 'Support & Feedback'}
                </Link>
              )}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
