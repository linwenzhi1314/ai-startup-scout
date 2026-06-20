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
    dashboard: string;
    signup: string;
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

  // 用户仪表盘
  dashboard: {
    title: string;
    welcome: string;
    subscription: {
      title: string;
      plan: string;
      status: string;
      statusActive: string;
      statusInactive: string;
      expires: string;
      upgradeButton: string;
    };
    stats: {
      searches: string;
      bookmarks: string;
      analyses: string;
    };
    recentSearches: {
      title: string;
      empty: string;
    };
    bookmarks: {
      title: string;
      empty: string;
      viewAll: string;
    };
    quickActions: {
      title: string;
      newSearch: string;
      getReport: string;
      viewTrends: string;
    };
    sidebar: {
      overview: string;
      bookmarks: string;
      history: string;
      settings: string;
      logout: string;
    };
  };

  // 账户设置
  settings: {
    title: string;
    profile: {
      title: string;
      email: string;
      name: string;
      namePlaceholder: string;
      saveButton: string;
      savingButton: string;
      successMessage: string;
    };
    password: {
      title: string;
      current: string;
      currentPlaceholder: string;
      new: string;
      newPlaceholder: string;
      confirm: string;
      confirmPlaceholder: string;
      changeButton: string;
      changingButton: string;
      successMessage: string;
    };
    subscription: {
      title: string;
      currentPlan: string;
      billingCycle: string;
      nextBilling: string;
      changePlan: string;
      cancelPlan: string;
    };
    danger: {
      title: string;
      deleteAccount: string;
      deleteWarning: string;
      deleteButton: string;
    };
    sidebar: {
      profile: string;
      password: string;
      subscription: string;
      danger: string;
    };
  };

  // 帮助中心
  help: {
    title: string;
    subtitle: string;
    categories: {
      gettingStarted: string;
      account: string;
      subscription: string;
      extension: string;
    };
    faq: Array<{
      category: string;
      items: Array<{
        question: string;
        answer: string;
      }>;
    }>;
    contact: {
      title: string;
      email: string;
      discord: string;
      responseTime: string;
    };
  };

  // 后台管理
  admin: {
    title: string;
    dashboard: {
      users: string;
      activeUsers: string;
      subscriptions: string;
      revenue: string;
    };
    users: {
      title: string;
      email: string;
      plan: string;
      status: string;
      createdAt: string;
      actions: string;
    };
    subscriptions: {
      title: string;
      active: string;
      cancelled: string;
      totalRevenue: string;
    };
    sidebar: {
      overview: string;
      users: string;
      subscriptions: string;
      analytics: string;
    };
  };

  // 关于我们
  about: {
    title: string;
    subtitle: string;
    mission: {
      title: string;
      content: string;
    };
    team: {
      title: string;
      members: Array<{
        name: string;
        role: string;
        bio: string;
      }>;
    };
    story: {
      title: string;
      content: string[];
    };
    values: {
      title: string;
      items: Array<{
        title: string;
        desc: string;
      }>;
    };
    contact: {
      title: string;
      email: string;
      location: string;
    };
  };

  // 博客
  blog: {
    title: string;
    subtitle: string;
    readMore: string;
    categories: string[];
    recentPosts: {
      title: string;
      empty: string;
    };
  };
}

export const translations: Record<Locale, Translation> = {
  'zh-Hans': {
    nav: {
      features: '功能',
      howItWorks: '使用方式',
      installExtension: '安装扩展',
      dashboard: '仪表盘',
      signup: '注册',
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
    dashboard: {
      title: '用户仪表盘',
      welcome: '欢迎回来',
      subscription: {
        title: '订阅状态',
        plan: '当前方案',
        status: '状态',
        statusActive: '有效',
        statusInactive: '未订阅',
        expires: '到期时间',
        upgradeButton: '升级方案',
      },
      stats: {
        searches: '搜索次数',
        bookmarks: '收藏项目',
        analyses: 'AI 分析',
      },
      recentSearches: {
        title: '最近搜索',
        empty: '暂无搜索记录',
      },
      bookmarks: {
        title: '我的收藏',
        empty: '暂无收藏项目',
        viewAll: '查看全部',
      },
      quickActions: {
        title: '快捷操作',
        newSearch: '新搜索',
        getReport: '获取报告',
        viewTrends: '查看趋势',
      },
      sidebar: {
        overview: '概览',
        bookmarks: '收藏',
        history: '历史',
        settings: '设置',
        logout: '退出登录',
      },
    },
    settings: {
      title: '账户设置',
      profile: {
        title: '个人信息',
        email: '邮箱',
        name: '姓名',
        namePlaceholder: '请输入姓名',
        saveButton: '保存',
        savingButton: '保存中...',
        successMessage: '信息已更新',
      },
      password: {
        title: '修改密码',
        current: '当前密码',
        currentPlaceholder: '请输入当前密码',
        new: '新密码',
        newPlaceholder: '请输入新密码',
        confirm: '确认密码',
        confirmPlaceholder: '请再次输入新密码',
        changeButton: '修改密码',
        changingButton: '修改中...',
        successMessage: '密码已更新',
      },
      subscription: {
        title: '订阅管理',
        currentPlan: '当前方案',
        billingCycle: '计费周期',
        nextBilling: '下次扣费',
        changePlan: '更换方案',
        cancelPlan: '取消订阅',
      },
      danger: {
        title: '危险区域',
        deleteAccount: '删除账户',
        deleteWarning: '删除账户将永久清除所有数据，此操作不可撤销。',
        deleteButton: '删除账户',
      },
      sidebar: {
        profile: '个人信息',
        password: '密码',
        subscription: '订阅',
        danger: '危险区域',
      },
    },
    help: {
      title: '帮助中心',
      subtitle: '有问题？我们随时为您解答',
      categories: {
        gettingStarted: '入门指南',
        account: '账户问题',
        subscription: '订阅与支付',
        extension: '扩展使用',
      },
      faq: [
        {
          category: '入门指南',
          items: [
            { question: '如何安装扩展？', answer: '访问 Chrome Web Store，搜索 AI Startup Scout，点击"添加到 Chrome"即可安装。' },
            { question: '如何开始搜索？', answer: '安装后点击浏览器工具栏中的扩展图标，输入关键词即可开始搜索 AI 创业项目。' },
          ],
        },
        {
          category: '账户问题',
          items: [
            { question: '如何修改密码？', answer: '登录后进入账户设置 → 密码，输入当前密码和新密码即可修改。' },
            { question: '忘记密码怎么办？', answer: '在登录页面点击"忘记密码"，输入邮箱后我们会发送重置链接。' },
          ],
        },
        {
          category: '订阅与支付',
          items: [
            { question: '支持哪些支付方式？', answer: '我们支持支付宝、信用卡（Visa/MasterCard）等多种支付方式。' },
            { question: '如何取消订阅？', answer: '进入账户设置 → 订阅管理，点击"取消订阅"即可。取消后当前周期仍有效。' },
          ],
        },
        {
          category: '扩展使用',
          items: [
            { question: '搜索结果不准确怎么办？', answer: '尝试使用更具体的关键词，或选择分类筛选（融资/产品/开源/模型）。' },
            { question: '如何收藏项目？', answer: '在搜索结果中点击项目卡片上的收藏图标，即可添加到收藏列表。' },
          ],
        },
      ],
      contact: {
        title: '联系我们',
        email: 'support@aistartupscout.com',
        discord: '加入 Discord 社区',
        responseTime: '通常在24小时内回复',
      },
    },
    admin: {
      title: '后台管理',
      dashboard: {
        users: '总用户',
        activeUsers: '活跃用户',
        subscriptions: '订阅用户',
        revenue: '本月收入',
      },
      users: {
        title: '用户管理',
        email: '邮箱',
        plan: '方案',
        status: '状态',
        createdAt: '注册时间',
        actions: '操作',
      },
      subscriptions: {
        title: '订阅管理',
        active: '活跃订阅',
        cancelled: '已取消',
        totalRevenue: '总收入',
      },
      sidebar: {
        overview: '概览',
        users: '用户',
        subscriptions: '订阅',
        analytics: '分析',
      },
    },
    about: {
      title: '关于我们',
      subtitle: '让每个人都能发现 AI 创业机会',
      mission: {
        title: '我们的使命',
        content: 'AI Startup Scout 致力于让 AI 创业信息触手可及，帮助创业者、投资人和从业者快速发现有价值的项目，洞察行业趋势。',
      },
      team: {
        title: '核心团队',
        members: [
          { name: '张明', role: '创始人 & CEO', bio: '前字节跳动产品经理，专注 AI 领域 5 年' },
          { name: '李华', role: '技术负责人', bio: '前腾讯工程师，全栈开发经验 8 年' },
          { name: '王芳', role: '产品负责人', bio: '前美团产品总监，用户体验专家' },
        ],
      },
      story: {
        title: '我们的故事',
        content: [
          '2023年初，我们在寻找 AI 创业项目时发现信息分散、难以系统化研究。',
          '于是我们开发了 AI Startup Scout，用技术解决这个痛点。',
          '如今，已有超过 10,000 用户使用我们的产品发现 AI 创业机会。',
        ],
      },
      values: {
        title: '我们的价值观',
        items: [
          { title: '用户至上', desc: '一切以用户价值为导向' },
          { title: '持续创新', desc: '不断探索更好的解决方案' },
          { title: '开放透明', desc: '保持诚实、开放的沟通' },
        ],
      },
      contact: {
        title: '联系我们',
        email: 'hello@aistartupscout.com',
        location: '中国深圳',
      },
    },
    blog: {
      title: '博客',
      subtitle: 'AI 创业洞察与行业分析',
      readMore: '阅读更多',
      categories: ['全部', '行业分析', '产品更新', '用户故事', '技术分享'],
      recentPosts: {
        title: '最新文章',
        empty: '暂无文章',
      },
    },
  },
  'en': {
    nav: {
      features: 'Features',
      howItWorks: 'How it Works',
      installExtension: 'Install Extension',
      dashboard: 'Dashboard',
      signup: 'Sign Up',
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
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome back',
      subscription: {
        title: 'Subscription',
        plan: 'Current Plan',
        status: 'Status',
        statusActive: 'Active',
        statusInactive: 'Not subscribed',
        expires: 'Expires',
        upgradeButton: 'Upgrade',
      },
      stats: {
        searches: 'Searches',
        bookmarks: 'Bookmarks',
        analyses: 'AI Analyses',
      },
      recentSearches: {
        title: 'Recent Searches',
        empty: 'No recent searches',
      },
      bookmarks: {
        title: 'My Bookmarks',
        empty: 'No bookmarks yet',
        viewAll: 'View All',
      },
      quickActions: {
        title: 'Quick Actions',
        newSearch: 'New Search',
        getReport: 'Get Report',
        viewTrends: 'View Trends',
      },
      sidebar: {
        overview: 'Overview',
        bookmarks: 'Bookmarks',
        history: 'History',
        settings: 'Settings',
        logout: 'Logout',
      },
    },
    settings: {
      title: 'Account Settings',
      profile: {
        title: 'Profile',
        email: 'Email',
        name: 'Name',
        namePlaceholder: 'Enter your name',
        saveButton: 'Save',
        savingButton: 'Saving...',
        successMessage: 'Profile updated',
      },
      password: {
        title: 'Change Password',
        current: 'Current Password',
        currentPlaceholder: 'Enter current password',
        new: 'New Password',
        newPlaceholder: 'Enter new password',
        confirm: 'Confirm Password',
        confirmPlaceholder: 'Enter new password again',
        changeButton: 'Change Password',
        changingButton: 'Changing...',
        successMessage: 'Password updated',
      },
      subscription: {
        title: 'Subscription',
        currentPlan: 'Current Plan',
        billingCycle: 'Billing Cycle',
        nextBilling: 'Next Billing',
        changePlan: 'Change Plan',
        cancelPlan: 'Cancel Subscription',
      },
      danger: {
        title: 'Danger Zone',
        deleteAccount: 'Delete Account',
        deleteWarning: 'Deleting your account will permanently remove all data. This action cannot be undone.',
        deleteButton: 'Delete Account',
      },
      sidebar: {
        profile: 'Profile',
        password: 'Password',
        subscription: 'Subscription',
        danger: 'Danger Zone',
      },
    },
    help: {
      title: 'Help Center',
      subtitle: 'Have questions? We\'re here to help',
      categories: {
        gettingStarted: 'Getting Started',
        account: 'Account',
        subscription: 'Subscription & Payment',
        extension: 'Extension',
      },
      faq: [
        {
          category: 'Getting Started',
          items: [
            { question: 'How to install the extension?', answer: 'Visit Chrome Web Store, search for AI Startup Scout, and click "Add to Chrome" to install.' },
            { question: 'How to start searching?', answer: 'After installation, click the extension icon in your browser toolbar and enter keywords to search AI startup projects.' },
          ],
        },
        {
          category: 'Account',
          items: [
            { question: 'How to change password?', answer: 'Go to Settings → Password after login, enter current and new password to change.' },
            { question: 'What if I forgot my password?', answer: 'Click "Forgot password" on login page, enter your email and we\'ll send a reset link.' },
          ],
        },
        {
          category: 'Subscription & Payment',
          items: [
            { question: 'What payment methods are supported?', answer: 'We support Alipay, credit cards (Visa/MasterCard) and more.' },
            { question: 'How to cancel subscription?', answer: 'Go to Settings → Subscription and click "Cancel Subscription". Current billing cycle remains valid after cancellation.' },
          ],
        },
        {
          category: 'Extension',
          items: [
            { question: 'Search results not accurate?', answer: 'Try using more specific keywords or select category filters (Funding/Product/Open Source/Model).' },
            { question: 'How to bookmark projects?', answer: 'Click the bookmark icon on project cards in search results to add to your bookmark list.' },
          ],
        },
      ],
      contact: {
        title: 'Contact Us',
        email: 'support@aistartupscout.com',
        discord: 'Join Discord Community',
        responseTime: 'Usually respond within 24 hours',
      },
    },
    admin: {
      title: 'Admin Dashboard',
      dashboard: {
        users: 'Total Users',
        activeUsers: 'Active Users',
        subscriptions: 'Subscribers',
        revenue: 'Monthly Revenue',
      },
      users: {
        title: 'User Management',
        email: 'Email',
        plan: 'Plan',
        status: 'Status',
        createdAt: 'Created',
        actions: 'Actions',
      },
      subscriptions: {
        title: 'Subscription Management',
        active: 'Active',
        cancelled: 'Cancelled',
        totalRevenue: 'Total Revenue',
      },
      sidebar: {
        overview: 'Overview',
        users: 'Users',
        subscriptions: 'Subscriptions',
        analytics: 'Analytics',
      },
    },
    about: {
      title: 'About Us',
      subtitle: 'Discover AI startup opportunities for everyone',
      mission: {
        title: 'Our Mission',
        content: 'AI Startup Scout is dedicated to making AI startup information accessible, helping entrepreneurs, investors and professionals quickly discover valuable projects and industry trends.',
      },
      team: {
        title: 'Core Team',
        members: [
          { name: 'Zhang Ming', role: 'Founder & CEO', bio: 'Former ByteDance PM, 5 years in AI' },
          { name: 'Li Hua', role: 'Tech Lead', bio: 'Former Tencent engineer, 8 years full-stack' },
          { name: 'Wang Fang', role: 'Product Lead', bio: 'Former Meituan PM Director, UX expert' },
        ],
      },
      story: {
        title: 'Our Story',
        content: [
          'In early 2023, we found AI startup information scattered and hard to research systematically.',
          'So we built AI Startup Scout to solve this pain point with technology.',
          'Today, over 10,000 users use our product to discover AI startup opportunities.',
        ],
      },
      values: {
        title: 'Our Values',
        items: [
          { title: 'User First', desc: 'Everything oriented by user value' },
          { title: 'Continuous Innovation', desc: 'Always exploring better solutions' },
          { title: 'Open & Transparent', desc: 'Honest and open communication' },
        ],
      },
      contact: {
        title: 'Contact Us',
        email: 'hello@aistartupscout.com',
        location: 'Shenzhen, China',
      },
    },
    blog: {
      title: 'Blog',
      subtitle: 'AI startup insights and industry analysis',
      readMore: 'Read More',
      categories: ['All', 'Industry Analysis', 'Product Updates', 'User Stories', 'Tech'],
      recentPosts: {
        title: 'Recent Posts',
        empty: 'No posts yet',
      },
    },
  },
};

export function getTranslation(locale: Locale): Translation {
  return translations[locale];
}