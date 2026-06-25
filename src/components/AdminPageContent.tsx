'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  CreditCard,
  BarChart3,
  TrendingUp,
  DollarSign,
  Activity,
  Settings,
  Shield,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Zap,
  Sun,
  Moon,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { Translation } from '@/lib/i18n/translations';
import { ProviderMetadata, PaymentProvider } from '@/lib/payment/types';

interface AdminPageContentProps {
  translation: Translation;
  locale: string;
}

// 主题配置
const themes = {
  dark: {
    bg: '#0F1117',
    sidebar: '#1A1D27',
    card: '#1A1D27',
    cardInner: '#0F1117',
    border: '#2D3348',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
  },
  light: {
    bg: '#F8FAFC',
    sidebar: '#FFFFFF',
    card: '#FFFFFF',
    cardInner: '#F1F5F9',
    border: '#E2E8F0',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
  }
};

// 后台统计数据类型
interface OverviewStats {
  users: number;
  subscriptions: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  expiredSubscriptions: number;
  revenue: string;
  feedback: number;
}

interface UserItem {
  id: number;
  email: string;
  plan: string;
  planId: string;
  status: string;
  provider: string | null;
  createdAt: string;
}

interface SubscriptionDetails {
  stats: {
    total: number;
    active: number;
    cancelled: number;
    expired: number;
    revenue: string;
  };
  planBreakdown: Record<string, number>;
  providerBreakdown: Record<string, number>;
  recentSubscriptions: Array<{
    id: number;
    email: string;
    plan_id: string;
    plan_name: string;
    status: string;
    provider: string;
    created_at: string;
    updated_at: string;
  }>;
}

const ADMIN_KEY = 'ai-startup-scout-admin-2024';

export function AdminPageContent({ translation, locale }: AdminPageContentProps) {
  const t = translation.admin;
  const [activeTab, setActiveTab] = useState('overview');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  // 真实数据 state
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(null);
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [subDetails, setSubDetails] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 客户端挂载后读取 localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('admin-theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setMounted(true);
  }, []);

  // 切换主题并保存
  const toggleTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    localStorage.setItem('admin-theme', newTheme);
  };

  const currentTheme = themes[theme];

  // 获取管理员 headers
  const getAdminHeaders = useCallback(() => {
    const key = localStorage.getItem('admin-key') || ADMIN_KEY;
    return { 'x-admin-key': key };
  }, []);

  // 加载总览数据
  const fetchOverview = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats?section=overview', {
        headers: getAdminHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setOverviewStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch overview:', error);
    }
  }, [getAdminHeaders]);

  // 加载用户列表
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats?section=users', {
        headers: getAdminHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(data.data);
        setUsersTotal(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }, [getAdminHeaders]);

  // 加载订阅详情
  const fetchSubscriptions = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats?section=subscriptions', {
        headers: getAdminHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setSubDetails(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    }
  }, [getAdminHeaders]);

  // 根据当前 tab 加载数据
  useEffect(() => {
    if (!mounted) return;
    
    setLoading(true);
    const load = async () => {
      switch (activeTab) {
        case 'overview':
          await fetchOverview();
          break;
        case 'users':
          await fetchUsers();
          break;
        case 'subscriptions':
          await fetchSubscriptions();
          break;
      }
      setLoading(false);
    };
    load();
  }, [activeTab, mounted, fetchOverview, fetchUsers, fetchSubscriptions]);

  // 刷新当前 tab
  const handleRefresh = async () => {
    setRefreshing(true);
    switch (activeTab) {
      case 'overview':
        await fetchOverview();
        break;
      case 'users':
        await fetchUsers();
        break;
      case 'subscriptions':
        await fetchSubscriptions();
        break;
    }
    setRefreshing(false);
  };

  // 防止 hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: currentTheme.bg }}>
      <div className="flex">
        {/* Sidebar */}
        <aside 
          className="w-64 border-r min-h-screen p-4 flex flex-col" 
          style={{ backgroundColor: currentTheme.sidebar, borderColor: currentTheme.border }}
        >
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#F59E0B]" />
                <h1 className="text-xl font-bold" style={{ color: currentTheme.textPrimary }}>{t.title}</h1>
              </div>
              
              {/* 主题切换按钮组 */}
              <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: currentTheme.cardInner }}>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`h-7 w-7 p-0 ${theme === 'light' ? 'bg-[#F59E0B]/20' : ''}`}
                  onClick={() => toggleTheme('light')}
                  title="亮色主题"
                >
                  <Sun className="h-4 w-4" style={{ color: theme === 'light' ? '#F59E0B' : currentTheme.textSecondary }} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`h-7 w-7 p-0 ${theme === 'dark' ? 'bg-[#6366F1]/20' : ''}`}
                  onClick={() => toggleTheme('dark')}
                  title="暗色主题"
                >
                  <Moon className="h-4 w-4" style={{ color: theme === 'dark' ? '#6366F1' : currentTheme.textSecondary }} />
                </Button>
              </div>
            </div>
            <Badge className="bg-[#F59E0B]/20 text-[#F59E0B]">管理员</Badge>
          </div>
          
          <nav className="space-y-2 flex-1">
            <Button
              variant={activeTab === 'overview' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              style={{ color: currentTheme.textSecondary }}
              onClick={() => setActiveTab('overview')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {t.sidebar.overview}
            </Button>
            <Button
              variant={activeTab === 'users' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              style={{ color: currentTheme.textSecondary }}
              onClick={() => setActiveTab('users')}
            >
              <Users className="w-4 h-4 mr-2" />
              {t.sidebar.users}
            </Button>
            <Button
              variant={activeTab === 'subscriptions' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              style={{ color: currentTheme.textSecondary }}
              onClick={() => setActiveTab('subscriptions')}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {t.sidebar.subscriptions}
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              style={{ color: currentTheme.textSecondary }}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {t.sidebar.analytics}
            </Button>
            <Button
              variant={activeTab === 'payment' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              style={{ color: currentTheme.textSecondary }}
              onClick={() => setActiveTab('payment')}
            >
              <Settings className="w-4 h-4 mr-2" />
              支付配置
            </Button>
          </nav>

          <div className="pt-4 border-t" style={{ borderColor: currentTheme.border }}>
            <Link href={`/${locale}/dashboard`}>
              <Button variant="ghost" className="w-full justify-start" style={{ color: currentTheme.textSecondary }}>
                ← 返回用户仪表盘
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold" style={{ color: currentTheme.textPrimary }}>{t.title}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              style={{ borderColor: currentTheme.border, color: currentTheme.textSecondary }}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              刷新
            </Button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-4 gap-4 mb-8">
                <Card style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Users className="w-8 h-8 text-[#6366F1]" />
                      <div>
                        <p className="text-2xl font-bold" style={{ color: currentTheme.textPrimary }}>
                          {overviewStats?.users ?? '-'}
                        </p>
                        <p style={{ color: currentTheme.textSecondary }}>{t.dashboard.users}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Activity className="w-8 h-8 text-[#10B981]" />
                      <div>
                        <p className="text-2xl font-bold" style={{ color: currentTheme.textPrimary }}>
                          {overviewStats?.activeSubscriptions ?? '-'}
                        </p>
                        <p style={{ color: currentTheme.textSecondary }}>活跃订阅</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-8 h-8 text-[#F59E0B]" />
                      <div>
                        <p className="text-2xl font-bold" style={{ color: currentTheme.textPrimary }}>
                          {overviewStats?.subscriptions ?? '-'}
                        </p>
                        <p style={{ color: currentTheme.textSecondary }}>{t.dashboard.subscriptions}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-8 h-8 text-[#10B981]" />
                      <div>
                        <p className="text-2xl font-bold" style={{ color: currentTheme.textPrimary }}>
                          {overviewStats?.revenue ?? '-'}
                        </p>
                        <p style={{ color: currentTheme.textSecondary }}>月度收入</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 额外统计 */}
              <div className="grid grid-cols-3 gap-4">
                <Card style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-8 h-8 text-[#6366F1]" />
                      <div>
                        <p className="text-2xl font-bold" style={{ color: currentTheme.textPrimary }}>
                          {overviewStats?.feedback ?? '-'}
                        </p>
                        <p style={{ color: currentTheme.textSecondary }}>用户反馈</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-8 h-8 text-[#EF4444]" />
                      <div>
                        <p className="text-2xl font-bold" style={{ color: currentTheme.textPrimary }}>
                          {overviewStats?.cancelledSubscriptions ?? '-'}
                        </p>
                        <p style={{ color: currentTheme.textSecondary }}>已取消</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Activity className="w-8 h-8 text-[#94A3B8]" />
                      <div>
                        <p className="text-2xl font-bold" style={{ color: currentTheme.textPrimary }}>
                          {overviewStats?.expiredSubscriptions ?? '-'}
                        </p>
                        <p style={{ color: currentTheme.textSecondary }}>已过期</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <Card style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: currentTheme.textPrimary }}>
                  {t.users.title}
                  <Badge variant="outline" style={{ borderColor: currentTheme.border, color: currentTheme.textSecondary }}>
                    共 {usersTotal} 人
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usersList.length === 0 ? (
                  <div className="text-center py-12" style={{ color: currentTheme.textSecondary }}>
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>暂无用户数据</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottomWidth: 1, borderColor: currentTheme.border }}>
                        <th className="text-left py-3" style={{ color: currentTheme.textSecondary }}>{t.users.email}</th>
                        <th className="text-left py-3" style={{ color: currentTheme.textSecondary }}>{t.users.plan}</th>
                        <th className="text-left py-3" style={{ color: currentTheme.textSecondary }}>{t.users.status}</th>
                        <th className="text-left py-3" style={{ color: currentTheme.textSecondary }}>支付方案</th>
                        <th className="text-left py-3" style={{ color: currentTheme.textSecondary }}>{t.users.createdAt}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((user) => (
                        <tr key={user.id} style={{ borderBottomWidth: 1, borderColor: currentTheme.border }}>
                          <td className="py-3" style={{ color: currentTheme.textPrimary }}>{user.email}</td>
                          <td className="py-3" style={{ color: currentTheme.textPrimary }}>{user.plan}</td>
                          <td className="py-3">
                            <Badge className={user.status === 'active' ? 'bg-[#10B981]/20 text-[#10B981]' : user.status === 'free' ? 'bg-[#94A3B8]/20 text-[#94A3B8]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}>
                              {user.status === 'active' ? '活跃' : user.status === 'free' ? '免费' : user.status}
                            </Badge>
                          </td>
                          <td className="py-3" style={{ color: currentTheme.textSecondary }}>
                            {user.provider || '-'}
                          </td>
                          <td className="py-3" style={{ color: currentTheme.textSecondary }}>
                            {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          )}

          {/* Subscriptions Tab */}
          {activeTab === 'subscriptions' && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <Card style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <CreditCard className="w-8 h-8 text-[#10B981] mx-auto mb-2" />
                      <p className="text-3xl font-bold" style={{ color: currentTheme.textPrimary }}>
                        {subDetails?.stats.active ?? '-'}
                      </p>
                      <p style={{ color: currentTheme.textSecondary }}>{t.subscriptions.active}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <CreditCard className="w-8 h-8 text-[#F59E0B] mx-auto mb-2" />
                      <p className="text-3xl font-bold" style={{ color: currentTheme.textPrimary }}>
                        {subDetails?.stats.cancelled ?? '-'}
                      </p>
                      <p style={{ color: currentTheme.textSecondary }}>{t.subscriptions.cancelled}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <DollarSign className="w-8 h-8 text-[#6366F1] mx-auto mb-2" />
                      <p className="text-3xl font-bold" style={{ color: currentTheme.textPrimary }}>
                        {subDetails?.stats.revenue ?? '-'}
                      </p>
                      <p style={{ color: currentTheme.textSecondary }}>{t.subscriptions.totalRevenue}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 最近订阅记录 */}
              {subDetails?.recentSubscriptions && subDetails.recentSubscriptions.length > 0 && (
                <Card style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
                  <CardHeader>
                    <CardTitle style={{ color: currentTheme.textPrimary }}>最近订阅记录</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottomWidth: 1, borderColor: currentTheme.border }}>
                          <th className="text-left py-3" style={{ color: currentTheme.textSecondary }}>邮箱</th>
                          <th className="text-left py-3" style={{ color: currentTheme.textSecondary }}>套餐</th>
                          <th className="text-left py-3" style={{ color: currentTheme.textSecondary }}>状态</th>
                          <th className="text-left py-3" style={{ color: currentTheme.textSecondary }}>支付方案</th>
                          <th className="text-left py-3" style={{ color: currentTheme.textSecondary }}>创建时间</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subDetails.recentSubscriptions.map((sub) => (
                          <tr key={sub.id} style={{ borderBottomWidth: 1, borderColor: currentTheme.border }}>
                            <td className="py-3" style={{ color: currentTheme.textPrimary }}>{sub.email || '-'}</td>
                            <td className="py-3" style={{ color: currentTheme.textPrimary }}>{sub.plan_name || sub.plan_id}</td>
                            <td className="py-3">
                              <Badge className={
                                sub.status === 'active' ? 'bg-[#10B981]/20 text-[#10B981]' :
                                sub.status === 'cancelled' ? 'bg-[#EF4444]/20 text-[#EF4444]' :
                                'bg-[#94A3B8]/20 text-[#94A3B8]'
                              }>
                                {sub.status}
                              </Badge>
                            </td>
                            <td className="py-3" style={{ color: currentTheme.textSecondary }}>{sub.provider}</td>
                            <td className="py-3" style={{ color: currentTheme.textSecondary }}>
                              {new Date(sub.created_at).toLocaleDateString('zh-CN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              )}

              {/* 方案分布 */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Card style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
                  <CardHeader>
                    <CardTitle style={{ color: currentTheme.textPrimary }}>套餐分布</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {subDetails?.planBreakdown && Object.entries(subDetails.planBreakdown).map(([plan, count]) => (
                      <div key={plan} className="flex justify-between py-2" style={{ borderBottomWidth: 1, borderColor: currentTheme.border }}>
                        <span style={{ color: currentTheme.textPrimary }}>{plan}</span>
                        <Badge variant="outline" style={{ borderColor: currentTheme.border, color: currentTheme.textSecondary }}>
                          {count}
                        </Badge>
                      </div>
                    ))}
                    {(!subDetails?.planBreakdown || Object.keys(subDetails.planBreakdown).length === 0) && (
                      <p style={{ color: currentTheme.textSecondary }} className="text-center py-4">暂无数据</p>
                    )}
                  </CardContent>
                </Card>
                <Card style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
                  <CardHeader>
                    <CardTitle style={{ color: currentTheme.textPrimary }}>支付方案分布</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {subDetails?.providerBreakdown && Object.entries(subDetails.providerBreakdown).map(([prov, count]) => (
                      <div key={prov} className="flex justify-between py-2" style={{ borderBottomWidth: 1, borderColor: currentTheme.border }}>
                        <span style={{ color: currentTheme.textPrimary }}>{prov}</span>
                        <Badge variant="outline" style={{ borderColor: currentTheme.border, color: currentTheme.textSecondary }}>
                          {count}
                        </Badge>
                      </div>
                    ))}
                    {(!subDetails?.providerBreakdown || Object.keys(subDetails.providerBreakdown).length === 0) && (
                      <p style={{ color: currentTheme.textSecondary }} className="text-center py-4">暂无数据</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <Card style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
              <CardHeader>
                <CardTitle style={{ color: currentTheme.textPrimary }}>数据分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12" style={{ color: currentTheme.textSecondary }}>
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>数据分析功能正在开发中...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Settings Tab */}
          {activeTab === 'payment' && (
            <PaymentSettingsSection locale={locale} theme={theme} currentTheme={currentTheme} />
          )}
        </main>
      </div>
    </div>
  );
}

// 支付配置管理组件
function PaymentSettingsSection({ locale, theme, currentTheme }: { locale: string; theme: 'dark' | 'light'; currentTheme: typeof themes.dark }) {
  const [providers, setProviders] = useState<ProviderMetadata[]>([]);
  const [activeProvider, setActiveProvider] = useState<PaymentProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentConfig();
  }, []);

  const fetchPaymentConfig = async () => {
    try {
      // 获取支付方案配置状态
      const configRes = await fetch('/api/payment/config');
      const configData = await configRes.json();
      
      // 获取当前激活的支付方案（从数据库）
      const providerRes = await fetch('/api/payment/provider');
      const providerData = await providerRes.json();
      
      if (configData.success) {
        setProviders(configData.providers);
        // 使用数据库中的配置作为当前激活方案
        setActiveProvider(providerData.activeProvider || configData.config.activeProvider);
      }
    } catch (error) {
      console.error('Failed to fetch payment config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchProvider = async (provider: PaymentProvider) => {
    setSwitching(true);
    setMessage(null);
    try {
      // 调用 provider API 切换支付方案（需要管理员鉴权）
      const adminKey = localStorage.getItem('admin-key') || ADMIN_KEY;
      const res = await fetch('/api/payment/provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({ provider }),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      if (data.success) {
        // 刷新配置
        await fetchPaymentConfig();
      }
    } catch (error) {
      setMessage('切换失败，请稍后重试');
    } finally {
      setSwitching(false);
    }
  };

  if (loading) {
    return (
      <Card style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
        <CardContent className="py-12">
          <div className="text-center" style={{ color: currentTheme.textSecondary }}>加载中...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 当前激活方案 */}
      <Card style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: currentTheme.textPrimary }}>
            <Zap className="w-5 h-5 text-[#F59E0B]" />
            当前支付方案
          </CardTitle>
          <CardDescription style={{ color: currentTheme.textSecondary }}>
            当前正在使用的支付方案，所有支付请求将通过此方案处理
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeProvider && (
            <div className="flex items-center gap-4">
              <Badge className="bg-[#6366F1]/20 text-[#6366F1] text-lg px-4 py-2">
                {providers.find(p => p.name === activeProvider)?.displayName || activeProvider}
              </Badge>
              <span style={{ color: currentTheme.textSecondary }}>
                {providers.find(p => p.name === activeProvider)?.configured ? '✅ 已配置' : '⚠️ 未配置'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 所有支付方案列表 */}
      <Card style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
        <CardHeader>
          <CardTitle style={{ color: currentTheme.textPrimary }}>支付方案列表</CardTitle>
          <CardDescription style={{ color: currentTheme.textSecondary }}>
            点击方案卡片可查看详情，切换方案需更新环境变量
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {providers.map((provider) => (
              <Card 
                key={provider.name}
                className={`border transition-all cursor-pointer hover:border-[#6366F1] ${
                  provider.name === activeProvider 
                    ? 'border-[#6366F1] ring-1 ring-[#6366F1]' 
                    : ''
                }`}
                style={{ 
                  backgroundColor: currentTheme.cardInner, 
                  borderColor: provider.name === activeProvider ? '#6366F1' : currentTheme.border 
                }}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: currentTheme.textPrimary }}>
                        {provider.displayName}
                        {provider.name === activeProvider && (
                          <Badge className="bg-[#F59E0B]/20 text-[#F59E0B] ml-2">当前</Badge>
                        )}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: currentTheme.textSecondary }}>{provider.feeDescription}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {provider.configured ? (
                        <Badge className="bg-[#10B981]/20 text-[#10B981]">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          已配置
                        </Badge>
                      ) : (
                        <Badge className="bg-[#F59E0B]/20 text-[#F59E0B]">
                          <XCircle className="w-3 h-3 mr-1" />
                          未配置
                        </Badge>
                      )}
                      {provider.handlesTax && (
                        <Badge className="bg-[#6366F1]/20 text-[#6366F1] text-xs">自动税务</Badge>
                      )}
                    </div>
                  </div>

                  {/* 特性列表 */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {provider.features.slice(0, 3).map((feature, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs px-2 py-1 rounded" 
                        style={{ color: currentTheme.textSecondary, backgroundColor: currentTheme.card }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2 mt-3">
                    {provider.configured && provider.name !== activeProvider && (
                      <Button 
                        size="sm"
                        className="bg-[#6366F1] hover:bg-[#6366F1]/80 text-white"
                        onClick={() => handleSwitchProvider(provider.name)}
                        disabled={switching}
                      >
                        切换到此方案
                      </Button>
                    )}
                    <Button 
                      size="sm"
                      variant="outline"
                      style={{ borderColor: currentTheme.border, color: currentTheme.textSecondary }}
                      onClick={() => window.open(provider.website, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      官网
                    </Button>
                  </div>

                  {/* 未配置提示 */}
                  {!provider.configured && (
                    <div className="mt-3 p-2 bg-[#F59E0B]/10 rounded text-xs text-[#F59E0B]">
                      需要配置环境变量才能使用
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 提示信息 */}
      {message && (
        <Card style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
          <CardContent className="py-4">
            <p style={{ color: currentTheme.textSecondary }}>{message}</p>
          </CardContent>
        </Card>
      )}

      {/* 配置指南 */}
      <Card style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
        <CardHeader>
          <CardTitle style={{ color: currentTheme.textPrimary }}>环境变量配置指南</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="p-3 rounded border" style={{ backgroundColor: currentTheme.cardInner, borderColor: currentTheme.border }}>
              <p className="text-[#6366F1] font-medium mb-2">Stripe（需要美国公司）</p>
              <code style={{ color: currentTheme.textSecondary }} className="block">STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET</code>
            </div>
            <div className="p-3 rounded border" style={{ backgroundColor: currentTheme.cardInner, borderColor: currentTheme.border }}>
              <p className="text-[#F59E0B] font-medium mb-2">Creem（推荐，个人可用）</p>
              <code style={{ color: currentTheme.textSecondary }} className="block">CREEM_API_KEY, CREEM_WEBHOOK_SECRET</code>
            </div>
            <div className="p-3 rounded border" style={{ backgroundColor: currentTheme.cardInner, borderColor: currentTheme.border }}>
              <p className="text-[#10B981] font-medium mb-2">LemonSqueezy（个人可用）</p>
              <code style={{ color: currentTheme.textSecondary }} className="block">LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID, LEMONSQUEEZY_WEBHOOK_SECRET</code>
            </div>
            <div className="p-3 rounded border" style={{ backgroundColor: currentTheme.cardInner, borderColor: currentTheme.border }}>
              <p className="text-[#6366F1] font-medium mb-2">Paddle（需要审核）</p>
              <code style={{ color: currentTheme.textSecondary }} className="block">PADDLE_API_KEY, PADDLE_WEBHOOK_SECRET_KEY</code>
            </div>
            <div className="p-3 rounded border" style={{ backgroundColor: currentTheme.cardInner, borderColor: currentTheme.border }}>
              <p className="font-medium mb-2" style={{ color: currentTheme.textSecondary }}>PayPal（传统方案）</p>
              <code style={{ color: currentTheme.textSecondary }} className="block">PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET</code>
            </div>
            <div className="p-3 rounded border border-[#6366F1]" style={{ backgroundColor: currentTheme.cardInner }}>
              <p className="text-[#6366F1] font-medium mb-2">切换方案</p>
              <code style={{ color: currentTheme.textSecondary }} className="block">PAYMENT_PROVIDER=creem|stripe|lemonsqueezy|paddle|paypal</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}