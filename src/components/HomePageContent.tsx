/**
 * @file 共享首页内容组件
 * @description 所有语言版本共用相同的布局和功能，只翻译文字
 */

'use client';

import { useState, useEffect } from 'react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Locale, Translation } from '@/lib/i18n/translations';

interface HomePageContentProps {
  locale: Locale;
  t: Translation;
}

const trackEvent = (eventName: string, eventParams?: Record<string, string>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams || {});
  }
};

export function HomePageContent({ locale, t }: HomePageContentProps) {
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  useEffect(() => {
    const d = process.env.NEXT_PUBLIC_COZE_PROJECT_DOMAIN_DEFAULT || window.location.origin || '';
    setDomain(d);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !role) return;

    setSubmitting(true);
    setSubscribeStatus('idle');

    try {
      const response = await fetch(`${domain}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tags: role })
      });

      const data = await response.json();

      if (data.success) {
        setSubscribeStatus('success');
        setSubscribeMessage(data.message || t.subscribe.successMessage);
        setEmail('');
        setRole('');
        trackEvent('subscribe_success', { role });
      } else {
        setSubscribeStatus('error');
        setSubscribeMessage(data.error || t.subscribe.errorMessage);
      }
    } catch {
      setSubscribeStatus('error');
      setSubscribeMessage(t.subscribe.errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // 生成语言前缀路径
  const basePath = locale === 'zh-Hans' ? '/zh-Hans' : '/en';

  return (
    <div className="min-h-screen bg-[#0F1117] text-white overflow-x-hidden">
      {/* 动效背景层 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[100px]"
          style={{ animationDuration: '4s' }}
        />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[80px] animate-pulse" />
      </div>

      {/* 导航栏 */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <a href={basePath} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" opacity="0.9" />
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">AI Startup Scout</span>
        </a>
        <div className="flex items-center gap-4">
          <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors hidden md:block">{t.nav.features}</a>
          <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors hidden md:block">{t.nav.howItWorks}</a>
          {/* Dashboard 和 Sign Up 按钮 */}
          <a
            href={`${basePath}/dashboard`}
            className="text-sm text-slate-300 hover:text-white transition-colors hidden md:block"
          >
            {t.nav.dashboard}
          </a>
          <a
            href={`${basePath}/signup`}
            className="px-4 py-2 border border-indigo-500/50 hover:border-indigo-400 text-indigo-300 hover:text-white text-sm font-medium rounded-lg transition-all hidden md:block"
          >
            {t.nav.signup}
          </a>
          <a
            href={domain ? `${domain}/api/download` : '#'}
            onClick={() => trackEvent('click_download', { button_location: 'nav' })}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-indigo-500/25"
          >
            {t.nav.installExtension}
          </a>
          <LanguageSwitcher />
        </div>
      </nav>

      {/* Hero 区域 */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs text-indigo-300">{t.hero.badge}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
          {t.hero.titleLine1}
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-amber-400 bg-clip-text text-transparent">
            {t.hero.titleLine2Highlight}
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed">
          {t.hero.description}
          <br className="hidden md:block" />
          {t.hero.descriptionLine2}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <a
            href="#how-it-works"
            onClick={() => trackEvent('click_cta', { button_name: 'start', button_location: 'hero' })}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 text-base"
          >
            {t.hero.startButton}
          </a>
          <a
            href="#features"
            onClick={() => trackEvent('click_cta', { button_name: 'learn', button_location: 'hero' })}
            className="px-8 py-3 border border-slate-700 hover:border-slate-500 text-slate-300 font-medium rounded-xl transition-all text-base"
          >
            {t.hero.learnButton}
          </a>
        </div>

        {/* 弹窗预览 Mockup */}
        <div className="mt-16 w-full max-w-sm">
          <div className="bg-[#1A1D27] border border-[#2D3348] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2D3348]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" opacity="0.9" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-slate-200">AI Startup Scout</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="px-4 pt-3 pb-2">
              <div className="flex items-center gap-2 bg-[#232736] border border-[#2D3348] rounded-lg px-3 py-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <span className="text-xs text-slate-500">{t.hero.mockupSearchPlaceholder}</span>
              </div>
              <div className="flex gap-1.5 mt-2">
                {t.hero.mockupTabs.map((tab, i) => (
                  <span
                    key={tab}
                    className={`px-2 py-0.5 text-[10px] rounded-full ${i === 0 ? 'bg-indigo-600 text-white' : 'border border-[#2D3348] text-slate-500'}`}
                  >
                    {tab}
                  </span>
                ))}
              </div>
            </div>
            <div className="px-4 pb-3 space-y-2">
              {t.hero.mockupItems.map((item) => (
                <div key={item.name} className="bg-[#232736] border border-[#2D3348] rounded-lg p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-200">{item.name}</span>
                    <span className="px-1.5 py-0.5 bg-indigo-500/15 text-indigo-400 text-[9px] rounded">{item.tag}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 border-t border-[#2D3348] bg-amber-500/5">
              <div className="flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                </svg>
                <span className="text-[10px] text-amber-400 font-medium">{t.hero.mockupAiAnalysis}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 核心功能区 */}
      <section id="features" className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t.features.title}</h2>
            <p className="mt-4 text-slate-400 text-lg">{t.features.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                ),
                title: t.features.items[0].title,
                desc: t.features.items[0].desc,
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                    <path d="M9 21h6M10 17v4M14 17v4" />
                  </svg>
                ),
                title: t.features.items[1].title,
                desc: t.features.items[1].desc,
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                ),
                title: t.features.items[2].title,
                desc: t.features.items[2].desc,
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group bg-[#1A1D27] border border-[#2D3348] rounded-2xl p-8 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 group-hover:bg-indigo-500/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使用方式区 */}
      <section id="how-it-works" className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t.howItWorks.title}</h2>
            <p className="mt-4 text-slate-400 text-lg">{t.howItWorks.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.howItWorks.items.map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white text-xl font-bold mb-5">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <a
              href={domain ? `${domain}/api/download` : '#'}
              onClick={() => trackEvent('click_download', { button_location: 'how_it_works' })}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 text-base"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17" />
                <path d="M2 12L12 17L22 12" />
              </svg>
              {t.howItWorks.installButton}
            </a>
          </div>
        </div>
      </section>

      {/* 订阅区域 */}
      <section className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{t.subscribe.title}</h2>
          <p className="mt-4 text-slate-400 text-lg mb-8">
            {t.subscribe.subtitle}
          </p>

          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.subscribe.placeholder}
                required
                className="flex-1 px-4 py-3 bg-[#232736] border border-[#2D3348] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="submit"
                disabled={submitting || !email || !role}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all whitespace-nowrap"
              >
                {submitting ? t.subscribe.buttonSubmitting : email && !role ? t.subscribe.buttonSelectRole : t.subscribe.button}
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {t.subscribe.roles.map((item) => (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => setRole(item.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    role === item.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-[#232736] text-slate-400 border border-[#2D3348] hover:border-indigo-500 hover:text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {subscribeStatus === 'success' && (
              <div className="px-4 py-3 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">
                {subscribeMessage}
              </div>
            )}

            {subscribeStatus === 'error' && (
              <div className="px-4 py-3 bg-red-500/15 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {subscribeMessage}
              </div>
            )}
          </form>

          <p className="text-xs text-slate-500 mt-4">
            {t.subscribe.privacyNote}
          </p>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="relative z-10 border-t border-[#2D3348] px-6 md:px-12 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" opacity="0.9" />
              </svg>
            </div>
            <span className="text-sm text-slate-400">AI Startup Scout</span>
          </div>
          <div className="flex items-center gap-6">
            <a href={`${basePath}/support`} className="text-sm text-slate-400 hover:text-white transition-colors">{t.footer.support}</a>
            <a href={`${basePath}/privacy`} className="text-sm text-slate-400 hover:text-white transition-colors">{t.footer.privacy}</a>
          </div>
          <p className="text-xs text-slate-600">{t.footer.tagline}</p>
        </div>
      </footer>
    </div>
  );
}