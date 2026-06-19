// 语言配置文件
export type Locale = 'en' | 'zh-Hans';

export const locales: Locale[] = ['en', 'zh-Hans'];

export const localeNames: Record<Locale, string> = {
  'en': 'English',
  'zh-Hans': '简体中文',
};

// 翻译字典
export const translations: Record<Locale, Record<string, string>> = {
  'en': {
    // 导航
    'nav.home': 'Home',
    'nav.features': 'Features',
    'nav.subscribe': 'Subscribe',
    'nav.about': 'About',
    
    // Hero
    'hero.title': 'AI Startup Scout',
    'hero.subtitle': 'One-click search for AI startup projects, with AI-powered deep analysis',
    'hero.install': 'Install Extension',
    'hero.download': 'Download',
    
    // 功能区
    'features.title': 'Core Features',
    'features.search.title': 'Smart Search',
    'features.search.desc': 'Search AI startup projects across multiple sources with intelligent filtering',
    'features.analyze.title': 'AI Analysis',
    'features.analyze.desc': 'Get deep insights and trend analysis powered by advanced AI models',
    'features.daily.title': 'Daily Report',
    'features.daily.desc': 'Receive curated AI startup news delivered to your inbox every morning',
    
    // 使用方式
    'howto.title': 'How to Use',
    'howto.step1': 'Install the Chrome extension',
    'howto.step2': 'Click the extension icon to search',
    'howto.step3': 'View AI-powered analysis',
    
    // 订阅区
    'subscribe.title': 'Subscribe to AI Startup Daily',
    'subscribe.desc': 'Curated AI startup news delivered to your inbox at 8 AM every day',
    'subscribe.placeholder': 'your@email.com',
    'subscribe.button': 'Subscribe',
    'subscribe.investor': 'Investor',
    'subscribe.founder': 'Founder',
    'subscribe.worker': 'Professional',
    'subscribe.privacy': 'We respect your privacy. Your email will only be used for daily updates. You can unsubscribe anytime.',
    'subscribe.success': 'Successfully subscribed!',
    'subscribe.already': 'This email is already subscribed.',
    
    // Footer
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.contact': 'Contact',
    'footer.copyright': '© 2024 AI Startup Scout',
    
    // 隐私政策页
    'privacy.title': 'Privacy Policy',
    'privacy.intro': 'We are committed to protecting your privacy and personal information.',
    
    // 支持页
    'support.title': 'Support',
    'support.desc': 'Have questions or feedback? We\'re here to help.',
    'support.email': 'Email',
    'support.feedback': 'Submit Feedback',
  },
  'zh-Hans': {
    // 导航
    'nav.home': '首页',
    'nav.features': '功能',
    'nav.subscribe': '订阅',
    'nav.about': '关于',
    
    // Hero
    'hero.title': 'AI Startup Scout',
    'hero.subtitle': '一键搜索 AI 创业项目，AI 深度分析市场趋势',
    'hero.install': '安装扩展',
    'hero.download': '下载',
    
    // 功能区
    'features.title': '核心功能',
    'features.search.title': '智能搜索',
    'features.search.desc': '多源搜索 AI 创业项目，智能过滤筛选',
    'features.analyze.title': 'AI 分析',
    'features.analyze.desc': 'AI 模型深度分析，洞察市场趋势',
    'features.daily.title': '每日日报',
    'features.daily.desc': '每天早 8 点精选 AI 创业动态直达邮箱',
    
    // 使用方式
    'howto.title': '使用方式',
    'howto.step1': '安装 Chrome 扩展',
    'howto.step2': '点击扩展图标搜索',
    'howto.step3': '查看 AI 深度分析',
    
    // 订阅区
    'subscribe.title': '订阅 AI 创业日报',
    'subscribe.desc': '每天早 8 点，精选 AI 创业动态直达你的邮箱',
    'subscribe.placeholder': 'your@email.com',
    'subscribe.button': '订阅',
    'subscribe.investor': '投资人',
    'subscribe.founder': '创业者',
    'subscribe.worker': '打工人',
    'subscribe.privacy': '我们尊重你的隐私，不会将邮箱用于其他用途，可随时取消订阅。',
    'subscribe.success': '订阅成功！',
    'subscribe.already': '该邮箱已订阅。',
    
    // Footer
    'footer.privacy': '隐私政策',
    'footer.terms': '服务条款',
    'footer.contact': '联系我们',
    'footer.copyright': '© 2024 AI Startup Scout',
    
    // 隐私政策页
    'privacy.title': '隐私政策',
    'privacy.intro': '我们致力于保护您的隐私和个人信息。',
    
    // 支持页
    'support.title': '支持',
    'support.desc': '有问题或反馈？我们随时为您提供帮助。',
    'support.email': '邮箱',
    'support.feedback': '提交反馈',
  },
};

// 获取翻译文本
export function getTranslation(locale: Locale, key: string): string {
  return translations[locale]?.[key] || key;
}

// 检测浏览器语言
export function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return 'zh-Hans';
  const browserLang = navigator.language;
  if (browserLang.startsWith('zh')) return 'zh-Hans';
  return 'en';
}