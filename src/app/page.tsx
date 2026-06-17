/**
 * @file Landing Page（首页）
 * @description AI Startup Scout 产品的落地页，包含：
 *              - 动效背景（渐变光晕动画）
 *              - 导航栏（Logo + 功能锚点 + 安装按钮）
 *              - Hero 区域（主标题 + 产品预览弹窗 Mockup）
 *              - 核心功能展示（智能搜索 / AI 分析 / 收藏追踪）
 *              - 使用方式指引（三步安装流程）
 *              - 页脚
 * @note 使用 'use client' 因为依赖 useEffect 获取运行时域名
 */

'use client';

// 导入 React Hooks：useState 管理域名状态，useEffect 在客户端挂载后获取域名
import { useState, useEffect } from 'react';

// 扩展版本号（每次更新扩展代码时需同步更新此常量）
const EXTENSION_VERSION = '1.4.1';

/**
 * GA4 事件跟踪函数
 * @param eventName 事件名称（如 'click_download', 'click_cta'）
 * @param eventParams 事件参数（可选，如 { button_location: 'nav' }）
 */
const trackEvent = (eventName: string, eventParams?: Record<string, string>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams || {});
  }
};

/**
 * 首页组件
 * 整体采用暗色主题（深空灰 #0F1117 基底），与扩展弹窗保持一致的视觉风格
 */
export default function Home() {
  // 后端域名状态，用于构造下载链接
  const [domain, setDomain] = useState('');
  
  // 订阅表单状态
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  /**
   * useEffect: 在客户端挂载后获取后端域名
   * 优先从 Next.js 公开环境变量读取，回退到当前页面 origin
   */
  useEffect(() => {
    const d = process.env.NEXT_PUBLIC_COZE_PROJECT_DOMAIN_DEFAULT || window.location.origin || '';
    setDomain(d);
  }, []); // 空依赖数组，仅在挂载时执行一次
  
  // 订阅处理函数
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
        setSubscribeMessage(data.message || '订阅成功！');
        setEmail('');
        setRole('');
        trackEvent('subscribe_success', { role });
      } else {
        setSubscribeStatus('error');
        setSubscribeMessage(data.error || '订阅失败，请稍后重试');
      }
    } catch {
      setSubscribeStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // 最外层容器：全屏暗色背景，白色文字，禁止水平滚动
    <div className="min-h-screen bg-[#0F1117] text-white overflow-x-hidden">

      {/* ===== 动效背景层 ===== */}
      {/* 使用 fixed 定位覆盖全屏，pointer-events-none 不阻挡交互 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* 靛蓝光晕 - 左上角，脉冲动画 */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" />
        {/* 琥珀光晕 - 右下角，4 秒周期 */}
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[100px]"
          style={{ animationDuration: '4s' }}
        />
        {/* 靛蓝光晕 - 中央，脉冲动画 */}
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-indigo-500/5 blur-[80px] animate-pulse" />
      </div>

      {/* ===== 导航栏 ===== */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        {/* Logo + 品牌名称 */}
        <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          {/* Logo 图标：靛蓝渐变圆角方块 + 白色层叠图形 */}
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" opacity="0.9" />
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {/* 品牌名称 */}
          <span className="text-lg font-semibold tracking-tight">AI Startup Scout</span>
        </a>
        {/* 右侧导航链接 + 安装按钮 */}
        <div className="flex items-center gap-4">
          {/* 功能锚点链接（桌面端可见） */}
          <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors hidden md:block">功能</a>
          <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors hidden md:block">使用方式</a>
          {/* 安装扩展按钮：链接到下载 API，点击时触发 GA4 事件 */}
          <a
            href={domain ? `${domain}/api/download` : '#'}
            onClick={() => trackEvent('click_download', { button_location: 'nav' })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-indigo-500/25"
          >
            安装扩展
            <span className="text-xs text-indigo-200 bg-indigo-700/50 px-1.5 py-0.5 rounded">v{EXTENSION_VERSION}</span>
          </a>
        </div>
      </nav>

      {/* ===== Hero 区域 ===== */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        {/* 顶部标签：Chrome 扩展标识 */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs text-indigo-300">Chrome 扩展</span>
        </div>

        {/* 主标题：发现下一个 AI 独角兽 */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
          发现下一个
          <br />
          {/* 渐变高亮文字：靛蓝 -> 靛蓝浅 -> 琥珀 */}
          <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-amber-400 bg-clip-text text-transparent">
            AI 独角兽
          </span>
        </h1>

        {/* 副标题描述 */}
        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed">
          智能搜索 AI 软件创业项目，一键获取市场洞察与投资分析。
          <br className="hidden md:block" />
          你的 AI 创业雷达，始终在线。
        </p>

        {/* CTA 按钮组 */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          {/* 主按钮：开始使用（锚点到使用方式区），点击时触发 GA4 事件 */}
          <a
            href="#how-it-works"
            onClick={() => trackEvent('click_cta', { button_name: 'start', button_location: 'hero' })}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 text-base"
          >
            开始使用
          </a>
          {/* 次按钮：了解功能（锚点到功能区），点击时触发 GA4 事件 */}
          <a
            href="#features"
            onClick={() => trackEvent('click_cta', { button_name: 'learn', button_location: 'hero' })}
            className="px-8 py-3 border border-slate-700 hover:border-slate-500 text-slate-300 font-medium rounded-xl transition-all text-base"
          >
            了解功能
          </a>
        </div>

        {/* ===== 弹窗预览 Mockup ===== */}
        {/* 模拟扩展弹窗的外观，给用户直观的产品印象 */}
        <div className="mt-16 w-full max-w-sm">
          <div className="bg-[#1A1D27] border border-[#2D3348] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            {/* 模拟弹窗顶栏 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2D3348]">
              <div className="flex items-center gap-2">
                {/* 小 Logo */}
                <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" opacity="0.9" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-slate-200">AI Startup Scout</span>
              </div>
              {/* 收藏图标 */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            {/* 模拟搜索栏 */}
            <div className="px-4 pt-3 pb-2">
              <div className="flex items-center gap-2 bg-[#232736] border border-[#2D3348] rounded-lg px-3 py-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <span className="text-xs text-slate-500">AI Agent 创业项目</span>
              </div>
              {/* 模拟分类标签 */}
              <div className="flex gap-1.5 mt-2">
                {['全部', '融资', '产品', '开源', '模型'].map((tab, i) => (
                  <span
                    key={tab}
                    className={`px-2 py-0.5 text-[10px] rounded-full ${i === 0 ? 'bg-indigo-600 text-white' : 'border border-[#2D3348] text-slate-500'}`}
                  >
                    {tab}
                  </span>
                ))}
              </div>
            </div>
            {/* 模拟搜索结果卡片 */}
            <div className="px-4 pb-3 space-y-2">
              {[
                { name: 'Cognosys AI', desc: 'AI Agent 自动化平台，完成复杂工作流', tag: '融资' },
                { name: 'LangChain', desc: 'LLM 应用开发框架，开源生态领先', tag: '开源' },
                { name: 'Mistral AI', desc: '欧洲AI新锐，开源模型赛道领跑者', tag: '模型' },
              ].map((item) => (
                <div key={item.name} className="bg-[#232736] border border-[#2D3348] rounded-lg p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-200">{item.name}</span>
                    <span className="px-1.5 py-0.5 bg-indigo-500/15 text-indigo-400 text-[9px] rounded">{item.tag}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
            {/* 模拟 AI 分析底栏 */}
            <div className="px-4 py-2 border-t border-[#2D3348] bg-amber-500/5">
              <div className="flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                </svg>
                <span className="text-[10px] text-amber-400 font-medium">AI 分析市场趋势...</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 核心功能区 ===== */}
      <section id="features" className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-5xl mx-auto">
          {/* 区域标题 */}
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">核心功能</h2>
            <p className="mt-4 text-slate-400 text-lg">专为 AI 创业者打造的搜索工具</p>
          </div>

          {/* 功能卡片网格：3 列布局 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                // 搜索图标
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                ),
                title: '智能搜索',
                desc: '输入关键词即可搜索全球 AI 创业项目，支持按融资、产品、开源、模型等分类筛选。',
              },
              {
                // AI 分析图标
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                    <path d="M9 21h6M10 17v4M14 17v4" />
                  </svg>
                ),
                title: 'AI 深度分析',
                desc: '一键生成市场洞察报告，重点推荐项目，投资建议，AI 为你解读行业趋势。',
              },
              {
                // 收藏图标
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                ),
                title: '收藏追踪',
                desc: '一键收藏感兴趣的项目，建立你的 AI 创业项目关注列表，随时回顾。',
              },
            ].map((feature) => (
              // 单个功能卡片：hover 时上移 + 边框亮起
              <div
                key={feature.title}
                className="group bg-[#1A1D27] border border-[#2D3348] rounded-2xl p-8 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5"
              >
                {/* 图标容器 */}
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 group-hover:bg-indigo-500/20 transition-colors">
                  {feature.icon}
                </div>
                {/* 功能标题 */}
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                {/* 功能描述 */}
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 使用方式区 ===== */}
      <section id="how-it-works" className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-4xl mx-auto">
          {/* 区域标题 */}
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">使用方式</h2>
            <p className="mt-4 text-slate-400 text-lg">三步开始发现 AI 创业机会</p>
          </div>

          {/* 步骤网格：3 列布局 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: '安装扩展', desc: '从 Chrome Web Store 安装 AI Startup Scout 扩展到浏览器' },
              { step: '02', title: '搜索项目', desc: '点击扩展图标，输入关键词搜索感兴趣的 AI 创业方向' },
              { step: '03', title: '获取洞察', desc: '使用 AI 分析功能获取市场洞察和投资建议' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                {/* 步骤编号徽章 */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white text-xl font-bold mb-5">
                  {item.step}
                </div>
                {/* 步骤标题 */}
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                {/* 步骤描述 */}
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* 底部安装按钮，点击时触发 GA4 事件 */}
          <div className="text-center mt-14">
            <a
              href={domain ? `${domain}/api/download` : '#'}
              onClick={() => trackEvent('click_download', { button_location: 'how_it_works' })}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 text-base"
            >
              {/* 下载图标 */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17" />
                <path d="M2 12L12 17L22 12" />
              </svg>
              立即安装
              <span className="text-xs text-indigo-200 bg-indigo-700/50 px-2 py-0.5 rounded-md">v{EXTENSION_VERSION}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ===== 订阅区域 ===== */}
      <section className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-lg mx-auto text-center">
          {/* 标题 */}
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">订阅 AI 创业日报</h2>
            {/* 说明文字 */}
            <p className="mt-4 text-slate-400 text-lg mb-8">
              每天早8点，精选AI创业动态直达你的邮箱
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-4">
              {/* 输入框 + 按钮同一行 */}
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-3 bg-[#232736] border border-[#2D3348] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={submitting || !email || !role}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all whitespace-nowrap"
                >
                  {submitting ? '提交中...' : email && !role ? '请先选择身份' : '订阅'}
                </button>
              </div>
              
              {/* 身份选择 - 简化为横向按钮组 */}
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { value: 'investor', label: '投资人' },
                  { value: 'entrepreneur', label: '创业者' },
                  { value: 'worker', label: '打工人' },
                ].map((item) => (
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
              
              {/* 成功提示 */}
              {subscribeStatus === 'success' && (
                <div className="px-4 py-3 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">
                  {subscribeMessage}
                </div>
              )}
              
              {/* 错误提示 */}
              {subscribeStatus === 'error' && (
                <div className="px-4 py-3 bg-red-500/15 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {subscribeMessage}
                </div>
              )}
            </form>
            
            {/* 隐私声明 */}
            <p className="text-xs text-slate-500 mt-4">
              我们尊重你的隐私，不会将邮箱用于其他用途。可随时取消订阅。
            </p>
        </div>
      </section>

      {/* ===== 页脚 ===== */}
      <footer className="relative z-10 border-t border-[#2D3348] px-6 md:px-12 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo + 品牌名 */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" opacity="0.9" />
              </svg>
            </div>
            <span className="text-sm text-slate-400">AI Startup Scout</span>
          </div>
          {/* 导航链接 */}
          <div className="flex items-center gap-6">
            <a href="/support" className="text-sm text-slate-400 hover:text-white transition-colors">支持与反馈</a>
            <a href="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">隐私政策</a>
          </div>
          {/* 版权描述 */}
          <p className="text-xs text-slate-600">AI 驱动的创业项目搜索引擎</p>
        </div>
      </footer>
    </div>
  );
}
