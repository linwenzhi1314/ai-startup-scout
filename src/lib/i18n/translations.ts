/**
 * @file 首页翻译配置
 * @description 中英文翻译文本
 */

export type Locale = 'zh-Hans' | 'en';

export interface Translation {
  // 导航栏
  nav: {
    features: string;
    howItWorks: string;
    installExtension: string;
  };
  
  // Hero 区域
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2Highlight: string;
    description: string;
    descriptionLine2: string;
    startButton: string;
    learnButton: string;
    mockupSearchPlaceholder: string;
    mockupTabs: string[];
    mockupItems: Array<{ name: string; desc: string; tag: string }>;
    mockupAiAnalysis: string;
  };
  
  // 核心功能
  features: {
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      desc: string;
    }>;
  };
  
  // 使用方式
  howItWorks: {
    title: string;
    subtitle: string;
    items: Array<{
      step: string;
      title: string;
      desc: string;
    }>;
    installButton: string;
  };
  
  // 订阅区域
  subscribe: {
    title: string;
    subtitle: string;
    placeholder: string;
    button: string;
    buttonSubmitting: string;
    buttonSelectRole: string;
    roles: Array<{ value: string; label: string }>;
    successMessage: string;
    errorMessage: string;
    privacyNote: string;
  };
  
  // 页脚
  footer: {
    support: string;
    privacy: string;
    tagline: string;
  };
}

export const translations: Record<Locale, Translation> = {
  'zh-Hans': {
    nav: {
      features: '功能',
      howItWorks: '使用方式',
      installExtension: '安装扩展',
    },
    hero: {
      badge: 'Chrome 扩展',
      titleLine1: '发现下一个',
      titleLine2Highlight: 'AI 独角兽',
      description: '智能搜索 AI 软件创业项目，一键获取市场洞察与投资分析。',
      descriptionLine2: '你的 AI 创业雷达，始终在线。',
      startButton: '开始使用',
      learnButton: '了解功能',
      mockupSearchPlaceholder: 'AI Agent 创业项目',
      mockupTabs: ['全部', '融资', '产品', '开源', '模型'],
      mockupItems: [
        { name: 'Cognosys AI', desc: 'AI Agent 自动化平台，完成复杂工作流', tag: '融资' },
        { name: 'LangChain', desc: 'LLM 应用开发框架，开源生态领先', tag: '开源' },
        { name: 'Mistral AI', desc: '欧洲AI新锐，开源模型赛道领跑者', tag: '模型' },
      ],
      mockupAiAnalysis: 'AI 分析市场趋势...',
    },
    features: {
      title: '核心功能',
      subtitle: '专为 AI 创业者打造的搜索工具',
      items: [
        { title: '智能搜索', desc: '输入关键词即可搜索全球 AI 创业项目，支持按融资、产品、开源、模型等分类筛选。' },
        { title: 'AI 深度分析', desc: '一键生成市场洞察报告，重点推荐项目，投资建议，AI 为你解读行业趋势。' },
        { title: '收藏追踪', desc: '一键收藏感兴趣的项目，建立你的 AI 创业项目关注列表，随时回顾。' },
      ],
    },
    howItWorks: {
      title: '使用方式',
      subtitle: '三步开始发现 AI 创业机会',
      items: [
        { step: '01', title: '安装扩展', desc: '从 Chrome Web Store 安装 AI Startup Scout 扩展到浏览器' },
        { step: '02', title: '搜索项目', desc: '点击扩展图标，输入关键词搜索感兴趣的 AI 创业方向' },
        { step: '03', title: '获取洞察', desc: '使用 AI 分析功能获取市场洞察和投资建议' },
      ],
      installButton: '立即安装',
    },
    subscribe: {
      title: '订阅 AI 创业日报',
      subtitle: '每天早8点，精选AI创业动态直达你的邮箱',
      placeholder: 'your@email.com',
      button: '订阅',
      buttonSubmitting: '提交中...',
      buttonSelectRole: '请先选择身份',
      roles: [
        { value: 'investor', label: '投资人' },
        { value: 'entrepreneur', label: '创业者' },
        { value: 'worker', label: '打工人' },
      ],
      successMessage: '订阅成功！',
      errorMessage: '订阅失败，请稍后重试',
      privacyNote: '我们尊重你的隐私，不会将邮箱用于其他用途。可随时取消订阅。',
    },
    footer: {
      support: '支持与反馈',
      privacy: '隐私政策',
      tagline: 'AI 驱动的创业项目搜索引擎',
    },
  },
  'en': {
    nav: {
      features: 'Features',
      howItWorks: 'How it Works',
      installExtension: 'Install Extension',
    },
    hero: {
      badge: 'Chrome Extension',
      titleLine1: 'Discover the Next',
      titleLine2Highlight: 'AI Unicorn',
      description: 'Smart search for AI software startup projects, get market insights and investment analysis in one click.',
      descriptionLine2: 'Your AI startup radar, always online.',
      startButton: 'Get Started',
      learnButton: 'Learn More',
      mockupSearchPlaceholder: 'AI Agent startup projects',
      mockupTabs: ['All', 'Funding', 'Product', 'Open Source', 'Model'],
      mockupItems: [
        { name: 'Cognosys AI', desc: 'AI Agent automation platform for complex workflows', tag: 'Funding' },
        { name: 'LangChain', desc: 'LLM application development framework, leading open source ecosystem', tag: 'Open Source' },
        { name: 'Mistral AI', desc: 'European AI innovator, leading open source model track', tag: 'Model' },
      ],
      mockupAiAnalysis: 'AI analyzing market trends...',
    },
    features: {
      title: 'Core Features',
      subtitle: 'A search tool built for AI entrepreneurs',
      items: [
        { title: 'Smart Search', desc: 'Enter keywords to search global AI startup projects, filter by funding, product, open source, model and more.' },
        { title: 'AI Deep Analysis', desc: 'Generate market insight reports in one click, key project recommendations, investment advice, AI interprets industry trends for you.' },
        { title: 'Bookmark & Track', desc: 'One-click bookmark interesting projects, build your AI startup watchlist, review anytime.' },
      ],
    },
    howItWorks: {
      title: 'How it Works',
      subtitle: 'Three steps to discover AI startup opportunities',
      items: [
        { step: '01', title: 'Install Extension', desc: 'Install AI Startup Scout extension from Chrome Web Store to your browser' },
        { step: '02', title: 'Search Projects', desc: 'Click the extension icon, enter keywords to search for AI startup directions you are interested in' },
        { step: '03', title: 'Get Insights', desc: 'Use AI analysis feature to get market insights and investment recommendations' },
      ],
      installButton: 'Install Now',
    },
    subscribe: {
      title: 'Subscribe to AI Startup Daily',
      subtitle: 'Every morning at 8am, curated AI startup updates delivered to your inbox',
      placeholder: 'your@email.com',
      button: 'Subscribe',
      buttonSubmitting: 'Submitting...',
      buttonSelectRole: 'Please select your role',
      roles: [
        { value: 'investor', label: 'Investor' },
        { value: 'entrepreneur', label: 'Entrepreneur' },
        { value: 'worker', label: 'Professional' },
      ],
      successMessage: 'Subscription successful!',
      errorMessage: 'Subscription failed, please try again later',
      privacyNote: 'We respect your privacy and will not use your email for other purposes. You can unsubscribe anytime.',
    },
    footer: {
      support: 'Support & Feedback',
      privacy: 'Privacy Policy',
      tagline: 'AI-powered startup project search engine',
    },
  },
};

export function getTranslation(locale: Locale): Translation {
  return translations[locale];
}