'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Bookmark,
  History,
  Settings,
  LogOut,
  TrendingUp,
  FileText,
  Zap,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { Translation } from '@/lib/i18n/translations';

interface DashboardPageContentProps {
  translation: Translation;
  locale: string;
  userId?: string;
}

interface UserData {
  user: { id: string; email: string; createdAt: string };
  subscription: {
    planId: string;
    planName: string;
    status: string;
    provider: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  } | null;
}

export function DashboardPageContent({ translation, locale, userId }: DashboardPageContentProps) {
  const t = translation.dashboard;
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetch(`/api/user/data`, {
        headers: { authorization: `Bearer ${userId}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) setUserData(data.data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [userId]);

  const subscription = userData?.subscription;
  const planName = subscription?.planName || (locale === 'zh-Hans' ? '免费版' : 'Free');
  const statusActive = subscription?.status === 'active';
  const expiresDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString(locale === 'zh-Hans' ? 'zh-CN' : 'en-US')
    : '-';

  return (
    <div className="min-h-screen bg-[#0F1117]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1A1D27] border-r border-[#2D3348] min-h-screen p-4">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-[#F1F5F9] flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#6366F1]" />
              AI Startup Scout
            </h1>
          </div>
          
          <nav className="space-y-2">
            <Button variant={activeTab === 'overview' ? 'secondary' : 'ghost'} className="w-full justify-start text-[#94A3B8] hover:text-[#F1F5F9]" onClick={() => setActiveTab('overview')}>
              <TrendingUp className="w-4 h-4 mr-2" />
              {t.sidebar.overview}
            </Button>
            <Button variant={activeTab === 'bookmarks' ? 'secondary' : 'ghost'} className="w-full justify-start text-[#94A3B8] hover:text-[#F1F5F9]" onClick={() => setActiveTab('bookmarks')}>
              <Bookmark className="w-4 h-4 mr-2" />
              {t.sidebar.bookmarks}
            </Button>
            <Button variant={activeTab === 'history' ? 'secondary' : 'ghost'} className="w-full justify-start text-[#94A3B8] hover:text-[#F1F5F9]" onClick={() => setActiveTab('history')}>
              <History className="w-4 h-4 mr-2" />
              {t.sidebar.history}
            </Button>
            <Link href={`/${locale}/dashboard/settings`}>
              <Button variant="ghost" className="w-full justify-start text-[#94A3B8] hover:text-[#F1F5F9]">
                <Settings className="w-4 h-4 mr-2" />
                {t.sidebar.settings}
              </Button>
            </Link>
          </nav>

          <div className="mt-8 pt-8 border-t border-[#2D3348]">
            <Button variant="ghost" className="w-full justify-start text-[#94A3B8] hover:text-[#F59E0B]">
              <LogOut className="w-4 h-4 mr-2" />
              {t.sidebar.logout}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#F1F5F9]">{t.title}</h2>
            <p className="text-[#94A3B8] mt-1">{t.welcome}, {userData?.user.email || (locale === 'zh-Hans' ? '访客' : 'Guest')}</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#6366F1] animate-spin" />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <Card className="bg-[#1A1D27] border-[#2D3348]">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Search className="w-8 h-8 text-[#6366F1] mx-auto mb-2" />
                      <p className="text-3xl font-bold text-[#F1F5F9]">-</p>
                      <p className="text-[#94A3B8]">{t.stats.searches}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-[#1A1D27] border-[#2D3348]">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Bookmark className="w-8 h-8 text-[#F59E0B] mx-auto mb-2" />
                      <p className="text-3xl font-bold text-[#F1F5F9]">-</p>
                      <p className="text-[#94A3B8]">{t.stats.bookmarks}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-[#1A1D27] border-[#2D3348]">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <FileText className="w-8 h-8 text-[#10B981] mx-auto mb-2" />
                      <p className="text-3xl font-bold text-[#F1F5F9]">-</p>
                      <p className="text-[#94A3B8]">{t.stats.analyses}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Subscription Status */}
              <Card className="bg-[#1A1D27] border-[#2D3348] mb-8">
                <CardHeader>
                  <CardTitle className="text-[#F1F5F9]">{t.subscription.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-[#94A3B8]">{t.subscription.plan}</p>
                        <p className="text-[#F1F5F9] font-semibold">{planName}</p>
                      </div>
                      <div>
                        <p className="text-[#94A3B8]">{t.subscription.status}</p>
                        <Badge className={statusActive ? "bg-[#10B981]/20 text-[#10B981]" : "bg-[#94A3B8]/20 text-[#94A3B8]"}>
                          {statusActive ? t.subscription.statusActive : (locale === 'zh-Hans' ? '未订阅' : 'No Plan')}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-[#94A3B8]">{t.subscription.expires}</p>
                        <p className="text-[#F1F5F9]">{expiresDate}</p>
                      </div>
                    </div>
                    <Link href={`/${locale}/pricing`}>
                      <Button className="bg-[#6366F1] hover:bg-[#6366F1]/80">
                        {t.subscription.upgradeButton}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-[#1A1D27] border-[#2D3348] mb-8">
                <CardHeader>
                  <CardTitle className="text-[#F1F5F9]">{t.quickActions.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button className="bg-[#6366F1] hover:bg-[#6366F1]/80 flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      {t.quickActions.newSearch}
                    </Button>
                    <Button variant="outline" className="border-[#2D3348] text-[#94A3B8] hover:text-[#F1F5F9] flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {t.quickActions.getReport}
                    </Button>
                    <Button variant="outline" className="border-[#2D3348] text-[#94A3B8] hover:text-[#F1F5F9] flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      {t.quickActions.viewTrends}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Searches & Bookmarks */}
              <div className="grid grid-cols-2 gap-8">
                <Card className="bg-[#1A1D27] border-[#2D3348]">
                  <CardHeader>
                    <CardTitle className="text-[#F1F5F9]">{t.recentSearches.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#94A3B8]">{t.recentSearches.empty}</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#1A1D27] border-[#2D3348]">
                  <CardHeader>
                    <CardTitle className="text-[#F1F5F9]">{t.bookmarks.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#94A3B8]">{t.bookmarks.empty}</p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
