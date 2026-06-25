'use client';

import { useState } from 'react';
import { getTranslation, type Locale } from '@/lib/i18n/translations';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Check, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface PricingPageContentProps {
  locale: Locale;
}

// 计划 ID 映射
const PLAN_IDS = ['free', 'pro_monthly', 'investor_monthly', 'enterprise'];

export function PricingPageContent({ locale }: PricingPageContentProps) {
  const t = getTranslation(locale);
  const pricing = t.pricing;
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const toggleFaq = (index: number) => {
    setExpandedFaqs(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  // 处理支付按钮点击
  const handlePayment = async (planIndex: number) => {
    // 免费版不需要支付
    if (planIndex === 0) {
      window.location.href = `/${locale}/signup`;
      return;
    }

    // 企业版跳转联系
    if (planIndex === 3) {
      window.location.href = `/${locale}/support`;
      return;
    }

    const planId = PLAN_IDS[planIndex];
    setError(null);
    setLoadingPlan(planId);

    try {
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          locale,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Payment initialization failed');
      }

      // 跳转到支付页面
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Payment error:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      
      // 如果是支付方案未配置，提示更友好的信息
      if (message.includes('not configured')) {
        setError(locale === 'zh-Hans' 
          ? '支付服务暂未配置，请联系客服' 
          : 'Payment service is not configured yet, please contact support');
      } else {
        setError(locale === 'zh-Hans' ? '支付初始化失败，请稍后重试' : 'Payment initialization failed, please try again');
      }
      setLoadingPlan(null);
    }
  };
  
  // 价格卡片颜色配置
  const cardStyles = [
    { bg: 'bg-slate-800/50', border: 'border-slate-700', button: 'bg-slate-700 hover:bg-slate-600' },
    { bg: 'bg-indigo-900/30', border: 'border-indigo-500', button: 'bg-indigo-600 hover:bg-indigo-500', highlight: true },
    { bg: 'bg-amber-900/20', border: 'border-amber-600/50', button: 'bg-amber-600 hover:bg-amber-500' },
    { bg: 'bg-emerald-900/20', border: 'border-emerald-600/50', button: 'bg-emerald-600 hover:bg-emerald-500' },
  ];
  
  return (
    <div className="min-h-screen bg-[#0F1117] text-[#F1F5F9]">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F1117]/80 backdrop-blur-md border-b border-[#2D3348]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <a href={locale === 'zh-Hans' ? '/zh-Hans' : '/en'} className="text-xl font-semibold">
                AI Startup Scout
              </a>
              <a 
                href={locale === 'zh-Hans' ? '/zh-Hans#features' : '/en#features'} 
                className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
              >
                {t.nav.features}
              </a>
              <a 
                href={locale === 'zh-Hans' ? '/zh-Hans/pricing' : '/en/pricing'} 
                className="text-[#6366F1] font-medium"
              >
                {locale === 'zh-Hans' ? '定价' : 'Pricing'}
              </a>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
      
      {/* Hero 区域 */}
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{pricing.title}</h1>
          <p className="text-xl text-[#94A3B8] mb-8">{pricing.subtitle}</p>
        </div>
      </div>
      
      {/* 价格卡片 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricing.plans.map((plan, index) => {
            const style = cardStyles[index];
            return (
              <div 
                key={plan.name}
                className={`rounded-xl p-6 border ${style.bg} ${style.border} ${style.highlight ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#0F1117]' : ''}`}
              >
                {style.highlight && (
                  <div className="text-xs font-medium text-indigo-400 mb-4">
                    {locale === 'zh-Hans' ? '最受欢迎' : 'Most Popular'}
                  </div>
                )}
                
                <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-[#94A3B8]">{plan.period}</span>
                </div>
                
                <p className="text-sm text-[#94A3B8] mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <Check className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => handlePayment(index)}
                  disabled={loadingPlan === PLAN_IDS[index]}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${style.button} text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loadingPlan === PLAN_IDS[index] ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {locale === 'zh-Hans' ? '处理中...' : 'Processing...'}
                    </>
                  ) : (
                    plan.buttonText
                  )}
                </button>
              </div>
            );
          })}
        </div>
        
        {/* 错误提示 */}
        {error && (
          <div className="max-w-md mx-auto mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}
      </div>
      
      {/* FAQ 区域 */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">{pricing.faqTitle}</h2>
        
        <div className="space-y-4">
          {pricing.faqItems.map((faq, index) => (
            <div 
              key={index}
              className="bg-[#1A1D27] rounded-lg border border-[#2D3348]"
            >
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="font-medium">{faq.question}</span>
                {expandedFaqs.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-[#94A3B8]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#94A3B8]" />
                )}
              </button>
              
              {expandedFaqs.includes(index) && (
                <div className="px-6 pb-4 text-[#94A3B8]">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* 页脚 */}
      <footer className="border-t border-[#2D3348] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-[#94A3B8]">
              {t.footer.tagline}
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a 
                href={locale === 'zh-Hans' ? '/zh-Hans/support' : '/en/support'} 
                className="text-sm text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
              >
                {t.footer.support}
              </a>
              <a 
                href={locale === 'zh-Hans' ? '/zh-Hans/privacy' : '/en/privacy'} 
                className="text-sm text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
              >
                {t.footer.privacy}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}