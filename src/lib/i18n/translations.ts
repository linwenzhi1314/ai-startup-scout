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
  
  // 定价页
  pricing: {
    title: string;
    subtitle: string;
    plans: Array<{
      name: string;
      price: string;
      period: string;
      description: string;
      features: string[];
      buttonText: string;
      popular?: boolean;
    }>;
    faqTitle: string;
    faqItems: Array<{
      question: string;
      answer: string;
    }>;
  };

  // 登录页
  login: {
    title: string;
    subtitle: string;
    error: string;
    email: string;
    password: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    submitButton: string;
    submittingButton: string;
    forgotPassword: string;
    noAccount: string;
    signupLink: string;
    loginSuccess: string;
    loginError: string;
    oauthGoogle: string;
    oauthGithub: string;
  };

  // 注册页
  signup: {
    title: string;
    subtitle: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    submitButton: string;
    submittingButton: string;
    hasAccount: string;
    loginLink: string;
    successTitle: string;
    successMessage: string;
    backToLogin: string;
    signupError: string;
    termsNote: string;
    error: string;
  };

  // 服务条款页
  terms: {
    title: string;
    lastUpdated: string;
    sections: Array<{
      title: string;
      content: string[];
    }>;
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
    pricing: {
      title: '选择适合你的方案',
      subtitle: '从免费版开始，随时升级获取更多功能',
      plans: [
        {
          name: '免费版',
          price: '¥0',
          period: '永久免费',
          description: '适合想要了解 AI 创业动态的用户',
          features: [
            '每日 AI 创业日报',
            '基础搜索功能',
            '最多收藏 10 个项目',
            '社区支持',
          ],
          buttonText: '免费开始',
        },
        {
          name: '专业版',
          price: '¥29',
          period: '/月',
          description: '适合创业者和从业者深度研究',
          features: [
            '深度 AI 分析报告',
            '无限收藏项目',
            '项目对比功能',
            '趋势预测分析',
            '邮件优先支持',
          ],
          buttonText: '开始试用',
          popular: true,
        },
        {
          name: '投资版',
          price: '¥199',
          period: '/月',
          description: '适合投资人进行项目筛选',
          features: [
            '精选项目推荐',
            '投资价值评估',
            '团队背景分析',
            '竞品对比矩阵',
            '专属客服支持',
            'API 接口访问',
          ],
          buttonText: '联系咨询',
        },
        {
          name: '企业版',
          price: '¥999',
          period: '/次',
          description: '项目对接服务，适合机构投资者',
          features: [
            '一对一项目对接',
            '定制化筛选方案',
            '路演安排服务',
            '投资意向书模板',
            '法律合规咨询',
            '专属顾问全程跟进',
          ],
          buttonText: '预约咨询',
        },
      ],
      faqTitle: '常见问题',
      faqItems: [
        { question: '免费版和专业版有什么区别？', answer: '免费版提供每日日报和基础搜索，专业版提供深度 AI 分析、无限收藏等高级功能。' },
        { question: '可以随时取消订阅吗？', answer: '是的，你可以随时取消订阅，取消后当月仍可使用功能，下月不再收费。' },
        { question: '企业版服务如何进行？', answer: '企业版为一次性服务，预约后我们的专属顾问会与你联系，安排项目对接流程。' },
      ],
    },
    login: {
      title: '登录',
      subtitle: '登录你的 AI Startup Scout 账户',
      email: '邮箱',
      emailPlaceholder: '请输入邮箱',
      password: '密码',
      passwordPlaceholder: '请输入密码',
      submitButton: '登录',
      submittingButton: '登录中...',
      forgotPassword: '忘记密码？',
      noAccount: '还没有账户？',
      signupLink: '立即注册',
      error: '配置加载失败',
      loginSuccess: '登录成功',
      loginError: '登录失败',
      oauthGoogle: '使用 Google 登录',
      oauthGithub: '使用 GitHub 登录',
    },
    signup: {
      title: '注册',
      subtitle: '创建你的 AI Startup Scout 账户',
      email: '邮箱',
      emailPlaceholder: '请输入邮箱',
      password: '密码',
      passwordPlaceholder: '请输入密码（至少6位）',
      confirmPassword: '确认密码',
      confirmPasswordPlaceholder: '请再次输入密码',
      submitButton: '注册',
      submittingButton: '注册中...',
      hasAccount: '已有账户？',
      loginLink: '立即登录',
      successTitle: '注册成功！',
      successMessage: '请查收邮箱验证邮件，验证后即可登录。',
      backToLogin: '返回登录',
      signupError: '注册失败，请稍后重试',
      termsNote: '注册即表示您同意我们的服务条款',
      error: '配置加载失败',
    },
    terms: {
      title: '服务条款',
      lastUpdated: '最后更新：2024年6月',
      sections: [
        {
          title: '1. 服务说明',
          content: [
            'AI Startup Scout 是一款 Chrome 浏览器扩展，为用户提供 AI 创业项目的搜索和分析服务。',
            '我们保留随时修改、暂停或终止服务的权利。',
          ],
        },
        {
          title: '2. 用户责任',
          content: [
            '用户需确保提供的信息准确真实。',
            '用户不得利用本服务从事任何违法或侵权活动。',
            '用户应对其账户安全负责。',
          ],
        },
        {
          title: '3. 付费服务',
          content: [
            '付费订阅服务将按月收费，具体价格以定价页面为准。',
            '订阅费用将在每个计费周期开始时自动收取。',
            '用户可随时取消订阅，取消后当前计费周期仍有效。',
          ],
        },
        {
          title: '4. 数据与隐私',
          content: [
            '我们重视用户隐私，数据处理遵循隐私政策。',
            '用户数据仅用于提供服务，不会出售给第三方。',
          ],
        },
        {
          title: '5. 免责声明',
          content: [
            '本服务提供的分析仅供参考，不构成投资建议。',
            '我们不对用户基于本服务做出的决策承担责任。',
          ],
        },
        {
          title: '6. 争议解决',
          content: [
            '如发生争议，双方应友好协商解决。',
            '协商不成的，可提交至相关仲裁机构。',
          ],
        },
      ],
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
    pricing: {
      title: 'Choose Your Plan',
      subtitle: 'From free version to enterprise service, find the solution that suits you best',
      plans: [
        {
          name: 'Free',
          price: '$0',
          period: '/month',
          description: 'Basic features for startup enthusiasts',
          features: [
            'Daily AI Startup Newsletter',
            'Basic project search',
            '3 bookmarks',
            'Weekly market summary',
            'Community access',
          ],
          buttonText: 'Get Started',
        },
        {
          name: 'Pro',
          price: '$4.99',
          period: '/month',
          description: 'Deep analysis for professionals',
          features: [
            'AI deep analysis',
            'Unlimited bookmarks',
            'Real-time alerts',
            'Market trend reports',
            'Priority support',
            'Export reports',
          ],
          buttonText: 'Subscribe',
          popular: true,
        },
        {
          name: 'Investor',
          price: '$34.99',
          period: '/month',
          description: 'Selected projects for investors',
          features: [
            'Selected project recommendations',
            'Investment value assessment',
            'Team background analysis',
            'Competitor comparison matrix',
            'Dedicated support',
            'API access',
          ],
          buttonText: 'Contact Us',
        },
        {
          name: 'Enterprise',
          price: '$169',
          period: '/time',
          description: 'Project matching service for institutional investors',
          features: [
            'One-on-one project matching',
            'Customized screening',
            'Demo arrangement',
            'Investment template',
            'Legal consultation',
            'Full-process advisor',
          ],
          buttonText: 'Book Consultation',
        },
      ],
      faqTitle: 'FAQ',
      faqItems: [
        { question: 'What\'s the difference between Free and Pro?', answer: 'Free provides daily newsletter and basic search, Pro offers deep AI analysis, unlimited bookmarks and more.' },
        { question: 'Can I cancel subscription anytime?', answer: 'Yes, you can cancel anytime. You can still use features for the current month, no charge next month.' },
        { question: 'How does Enterprise service work?', answer: 'Enterprise is a one-time service. After booking, our dedicated advisor will contact you to arrange the process.' },
      ],
    },
    login: {
      title: 'Login',
      subtitle: 'Login to your AI Startup Scout account',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      submitButton: 'Login',
      submittingButton: 'Logging in...',
      forgotPassword: 'Forgot password?',
      noAccount: 'Don\'t have an account?',
      signupLink: 'Sign up now',
      error: 'Configuration load failed',
      loginSuccess: 'Login successful',
      loginError: 'Login failed',
      oauthGoogle: 'Login with Google',
      oauthGithub: 'Login with GitHub',
    },
    signup: {
      title: 'Sign Up',
      subtitle: 'Create your AI Startup Scout account',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      password: 'Password',
      passwordPlaceholder: 'Enter password (at least 6 characters)',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Enter password again',
      submitButton: 'Sign Up',
      submittingButton: 'Signing up...',
      hasAccount: 'Already have an account?',
      loginLink: 'Login now',
      successTitle: 'Sign Up Successful!',
      successMessage: 'Please check your email for verification, then you can login.',
      backToLogin: 'Back to Login',
      signupError: 'Sign up failed, please try again later',
      termsNote: 'By signing up, you agree to our Terms of Service',
      error: 'Configuration load failed',
    },
    terms: {
      title: 'Terms of Service',
      lastUpdated: 'Last Updated: June 2024',
      sections: [
        {
          title: '1. Service Description',
          content: [
            'AI Startup Scout is a Chrome browser extension providing AI startup project search and analysis services.',
            'We reserve the right to modify, suspend or terminate the service at any time.',
          ],
        },
        {
          title: '2. User Responsibilities',
          content: [
            'Users must ensure the information provided is accurate and authentic.',
            'Users shall not use this service for any illegal or infringing activities.',
            'Users are responsible for their account security.',
          ],
        },
        {
          title: '3. Paid Services',
          content: [
            'Paid subscription services will be charged monthly, specific prices are shown on the pricing page.',
            'Subscription fees will be automatically charged at the beginning of each billing cycle.',
            'Users can cancel subscription anytime, current billing cycle still valid after cancellation.',
          ],
        },
        {
          title: '4. Data & Privacy',
          content: [
            'We value user privacy, data processing follows our Privacy Policy.',
            'User data is only used to provide services and will not be sold to third parties.',
          ],
        },
        {
          title: '5. Disclaimer',
          content: [
            'Analysis provided by this service is for reference only and does not constitute investment advice.',
            'We are not responsible for decisions made by users based on this service.',
          ],
        },
        {
          title: '6. Dispute Resolution',
          content: [
            'In case of disputes, both parties should negotiate in good faith.',
            'If negotiation fails, may submit to relevant arbitration institution.',
          ],
        },
      ],
    },
  },
};

export function getTranslation(locale: Locale): Translation {
  return translations[locale];
}