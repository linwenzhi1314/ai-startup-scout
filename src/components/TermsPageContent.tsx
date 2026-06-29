'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { translations, Locale } from '@/lib/i18n/translations';
import { useManagedContent } from '@/hooks/useManagedContent';

interface TermsPageContentProps {
  locale: Locale;
}

interface TermsSection {
  title: string;
  content: string[];
}

interface TermsData {
  title: string;
  lastUpdated: string;
  sections: TermsSection[];
}

export default function TermsPageContent({ locale }: TermsPageContentProps) {
  const fallback = translations[locale];
  const basePath = locale === 'zh-Hans' ? '/zh-Hans' : '/en';
  const { data: termsData } = useManagedContent<TermsData>('terms', locale, {
    title: locale === 'zh-Hans' ? '服务条款' : 'Terms of Service',
    lastUpdated: locale === 'zh-Hans' ? '2025年1月' : 'January 2025',
    sections: []
  });

  return (
    <div className="min-h-screen bg-[#0F1117] text-[#F1F5F9]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#0F1117]/80 backdrop-blur-md border-b border-[#2D3348] z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={basePath} className="text-xl font-bold text-[#F1F5F9]">
            AI Startup Scout
          </Link>
          <Link href={basePath} className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors">
            {locale === 'zh-Hans' ? '返回首页' : 'Back to Home'}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-32">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {termsData.title}
        </h1>
        
        <div className="space-y-6 text-[#94A3B8] leading-relaxed">
          {termsData.sections.map((section, index) => (
            <section key={index}>
              <h2 className="text-xl font-semibold text-[#F1F5F9] mb-3">
                {section.title}
              </h2>
              {section.content.map((paragraph, pIndex) => (
                <p key={pIndex}>{paragraph}</p>
              ))}
              {/* Special link for privacy section */}
              {section.title.includes('隐私') || section.title.toLowerCase().includes('privacy') ? (
                <Link 
                  href={`${basePath}/privacy`} 
                  className="text-[#6366F1] hover:text-[#6366F1]/80 underline mt-2 inline-block"
                >
                  {locale === 'zh-Hans' ? '查看隐私政策' : 'View Privacy Policy'}
                </Link>
              ) : null}
            </section>
          ))}

          {/* Contact */}
          <section className="pt-8 border-t border-[#2D3348]">
            <h2 className="text-xl font-semibold text-[#F1F5F9] mb-3">
              {locale === 'zh-Hans' ? '联系我们' : 'Contact Us'}
            </h2>
            <p>
              {locale === 'zh-Hans'
                ? '如果您对服务条款有任何疑问，请联系我们：'
                : 'If you have any questions about our Terms of Service, please contact us:'}
            </p>
            <Link 
              href={`${basePath}/support`} 
              className="text-[#6366F1] hover:text-[#6366F1]/80 underline mt-2 inline-block"
            >
              {locale === 'zh-Hans' ? '支持与反馈' : 'Support & Feedback'}
            </Link>
          </section>

          {/* Last Updated */}
          <p className="text-sm text-[#64748B] pt-4">
            {locale === 'zh-Hans' 
              ? `最后更新：${termsData.lastUpdated}`
              : `Last updated: ${termsData.lastUpdated}`}
          </p>
        </div>
      </main>
    </div>
  );
}
