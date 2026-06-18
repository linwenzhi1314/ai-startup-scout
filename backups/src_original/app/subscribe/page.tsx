/**
 * @file 邮件订阅落地页
 * @description 用户可以订阅AI创业日报，选择兴趣标签（投资人/创业者/打工人）
 */

'use client';

import { useState, useEffect } from 'react';

// 兴趣标签选项
const INTEREST_TAGS = [
  { id: 'investor', label: '投资人', desc: '关注投资机会和市场趋势' },
  { id: 'founder', label: '创业者', desc: '寻找创业灵感和竞品动态' },
  { id: 'worker', label: '打工人', desc: '了解行业机会和职业发展' },
];

export default function SubscribePage() {
  const [email, setEmail] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // 处理标签选择
  const handleTagClick = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(t => t !== tagId) 
        : [...prev, tagId]
    );
  };

  // 提交订阅
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrorMessage('请输入邮箱地址');
      return;
    }
    
    if (selectedTags.length === 0) {
      setErrorMessage('请选择至少一个兴趣标签');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tags: selectedTags }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSubmitStatus('success');
        setEmail('');
        setSelectedTags([]);
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || '订阅失败，请稍后重试');
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage('网络错误，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-white overflow-x-hidden">
      {/* 动效背景层 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[100px]" style={{ animationDuration: '4s' }} />
      </div>

      {/* 导航栏 */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <a href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" opacity="0.9" />
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">AI Startup Scout</span>
        </a>
        <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors">返回首页</a>
      </nav>

      {/* 主内容区 */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 py-16 md:py-24">
        <div className="w-full max-w-md">
          {/* 标题区 */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span className="text-xs text-amber-300">每日推送</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              订阅 AI 创业日报
            </h1>
            <p className="text-slate-400 text-base md:text-lg">
              每天早8点，精选AI创业动态直达你的邮箱
            </p>
          </div>

          {/* 订阅表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 邮箱输入 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                邮箱地址
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-[#1A1D27] border border-[#2D3348] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            {/* 兴趣标签选择 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                你的身份（可多选）
              </label>
              <div className="space-y-3">
                {INTEREST_TAGS.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagClick(tag.id)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${
                      selectedTags.includes(tag.id)
                        ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                        : 'bg-[#1A1D27] border-[#2D3348] text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedTags.includes(tag.id)
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-slate-500'
                      }`}>
                        {selectedTags.includes(tag.id) && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <span className="font-medium">{tag.label}</span>
                        <span className="text-xs ml-2 opacity-70">{tag.desc}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 错误提示 */}
            {errorMessage && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {errorMessage}
              </div>
            )}

            {/* 成功提示 */}
            {submitStatus === 'success' && (
              <div className="px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                订阅成功！我们会在每天早8点发送日报到你的邮箱。
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-lg hover:shadow-indigo-500/25'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  正在提交...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  立即订阅
                </>
              )}
            </button>
          </form>

          {/* 底部说明 */}
          <p className="mt-6 text-center text-xs text-slate-500">
            我们尊重你的隐私，不会将邮箱用于其他用途。可随时取消订阅。
          </p>
        </div>
      </main>
    </div>
  );
}