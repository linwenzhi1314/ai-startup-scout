'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  CreditCard,
  BarChart3,
  TrendingUp,
  DollarSign,
  Activity,
  Settings,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { Translation } from '@/lib/i18n/translations';

interface AdminPageContentProps {
  translation: Translation;
  locale: string;
}

export function AdminPageContent({ translation, locale }: AdminPageContentProps) {
  const t = translation.admin;
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - will be replaced with real data from Supabase
  const mockDashboard = {
    users: 1247,
    activeUsers: 892,
    subscriptions: 156,
    revenue: '$4,892'
  };

  const mockUsers = [
    { id: 1, email: 'user1@example.com', plan: '专业版', status: 'active', createdAt: '2024-01-15' },
    { id: 2, email: 'user2@example.com', plan: '免费版', status: 'active', createdAt: '2024-02-20' },
    { id: 3, email: 'user3@example.com', plan: '投资版', status: 'active', createdAt: '2024-03-10' },
    { id: 4, email: 'user4@example.com', plan: '专业版', status: 'cancelled', createdAt: '2024-04-05' },
  ];

  const mockSubscriptions = {
    active: 156,
    cancelled: 23,
    totalRevenue: '$12,450'
  };

  return (
    <div className="min-h-screen bg-[#0F1117]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1A1D27] border-r border-[#2D3348] min-h-screen p-4">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-[#F59E0B]" />
              <h1 className="text-xl font-bold text-[#F1F5F9]">{t.title}</h1>
            </div>
            <Badge className="bg-[#F59E0B]/20 text-[#F59E0B]">管理员</Badge>
          </div>
          
          <nav className="space-y-2">
            <Button
              variant={activeTab === 'overview' ? 'secondary' : 'ghost'}
              className="w-full justify-start text-[#94A3B8] hover:text-[#F1F5F9]"
              onClick={() => setActiveTab('overview')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {t.sidebar.overview}
            </Button>
            <Button
              variant={activeTab === 'users' ? 'secondary' : 'ghost'}
              className="w-full justify-start text-[#94A3B8] hover:text-[#F1F5F9]"
              onClick={() => setActiveTab('users')}
            >
              <Users className="w-4 h-4 mr-2" />
              {t.sidebar.users}
            </Button>
            <Button
              variant={activeTab === 'subscriptions' ? 'secondary' : 'ghost'}
              className="w-full justify-start text-[#94A3B8] hover:text-[#F1F5F9]"
              onClick={() => setActiveTab('subscriptions')}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {t.sidebar.subscriptions}
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'secondary' : 'ghost'}
              className="w-full justify-start text-[#94A3B8] hover:text-[#F1F5F9]"
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {t.sidebar.analytics}
            </Button>
          </nav>

          <div className="mt-8 pt-8 border-t border-[#2D3348]">
            <Link href={`/${locale}/dashboard`}>
              <Button variant="ghost" className="w-full justify-start text-[#94A3B8] hover:text-[#F1F5F9]">
                ← 返回用户仪表盘
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h2 className="text-2xl font-bold text-[#F1F5F9] mb-8">{t.title}</h2>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <Card className="bg-[#1A1D27] border-[#2D3348]">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Users className="w-8 h-8 text-[#6366F1]" />
                      <div>
                        <p className="text-2xl font-bold text-[#F1F5F9]">{mockDashboard.users}</p>
                        <p className="text-[#94A3B8]">{t.dashboard.users}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-[#1A1D27] border-[#2D3348]">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Activity className="w-8 h-8 text-[#10B981]" />
                      <div>
                        <p className="text-2xl font-bold text-[#F1F5F9]">{mockDashboard.activeUsers}</p>
                        <p className="text-[#94A3B8]">{t.dashboard.activeUsers}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-[#1A1D27] border-[#2D3348]">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-8 h-8 text-[#F59E0B]" />
                      <div>
                        <p className="text-2xl font-bold text-[#F1F5F9]">{mockDashboard.subscriptions}</p>
                        <p className="text-[#94A3B8]">{t.dashboard.subscriptions}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-[#1A1D27] border-[#2D3348]">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-8 h-8 text-[#10B981]" />
                      <div>
                        <p className="text-2xl font-bold text-[#F1F5F9]">{mockDashboard.revenue}</p>
                        <p className="text-[#94A3B8]">{t.dashboard.revenue}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <Card className="bg-[#1A1D27] border-[#2D3348]">
              <CardHeader>
                <CardTitle className="text-[#F1F5F9]">{t.users.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2D3348]">
                      <th className="text-[#94A3B8] text-left py-3">{t.users.email}</th>
                      <th className="text-[#94A3B8] text-left py-3">{t.users.plan}</th>
                      <th className="text-[#94A3B8] text-left py-3">{t.users.status}</th>
                      <th className="text-[#94A3B8] text-left py-3">{t.users.createdAt}</th>
                      <th className="text-[#94A3B8] text-left py-3">{t.users.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="border-b border-[#2D3348]">
                        <td className="text-[#F1F5F9] py-3">{user.email}</td>
                        <td className="text-[#F1F5F9] py-3">{user.plan}</td>
                        <td className="py-3">
                          <Badge className={user.status === 'active' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="text-[#94A3B8] py-3">{user.createdAt}</td>
                        <td className="py-3">
                          <Button variant="ghost" size="sm" className="text-[#6366F1] hover:text-[#6366F1]">
                            查看
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {/* Subscriptions Tab */}
          {activeTab === 'subscriptions' && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <Card className="bg-[#1A1D27] border-[#2D3348]">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <CreditCard className="w-8 h-8 text-[#10B981] mx-auto mb-2" />
                      <p className="text-3xl font-bold text-[#F1F5F9]">{mockSubscriptions.active}</p>
                      <p className="text-[#94A3B8]">{t.subscriptions.active}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-[#1A1D27] border-[#2D3348]">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <CreditCard className="w-8 h-8 text-[#F59E0B] mx-auto mb-2" />
                      <p className="text-3xl font-bold text-[#F1F5F9]">{mockSubscriptions.cancelled}</p>
                      <p className="text-[#94A3B8]">{t.subscriptions.cancelled}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-[#1A1D27] border-[#2D3348]">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <DollarSign className="w-8 h-8 text-[#6366F1] mx-auto mb-2" />
                      <p className="text-3xl font-bold text-[#F1F5F9]">{mockSubscriptions.totalRevenue}</p>
                      <p className="text-[#94A3B8]">{t.subscriptions.totalRevenue}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <Card className="bg-[#1A1D27] border-[#2D3348]">
              <CardHeader>
                <CardTitle className="text-[#F1F5F9]">数据分析</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-[#94A3B8] py-12">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>数据分析功能正在开发中...</p>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}