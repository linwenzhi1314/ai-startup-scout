'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Lock,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { Translation } from '@/lib/i18n/translations';

interface SettingsPageContentProps {
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

export function SettingsPageContent({ translation, locale, userId }: SettingsPageContentProps) {
  const t = translation.settings;
  const [activeSection, setActiveSection] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
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
  const nextBilling = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString(locale === 'zh-Hans' ? 'zh-CN' : 'en-US')
    : '-';
  const billingCycle = subscription ? (locale === 'zh-Hans' ? '每月' : 'Monthly') : '-';

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSuccess('profile');
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const handleChangePassword = async () => {
    setIsChangingPassword(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsChangingPassword(false);
    setShowSuccess('password');
    setTimeout(() => setShowSuccess(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0F1117]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1A1D27] border-r border-[#2D3348] min-h-screen p-4">
          <div className="mb-8">
            <Link href={`/${locale}/dashboard`} className="text-xl font-bold text-[#F1F5F9] flex items-center gap-2 hover:text-[#6366F1]">
              ← {translation.dashboard.title}
            </Link>
          </div>

          <h2 className="text-lg font-semibold text-[#F1F5F9] mb-4">{t.title}</h2>
          
          <nav className="space-y-2">
            <Button variant={activeSection === 'profile' ? 'secondary' : 'ghost'} className="w-full justify-start text-[#94A3B8] hover:text-[#F1F5F9]" onClick={() => setActiveSection('profile')}>
              <User className="w-4 h-4 mr-2" />{t.sidebar.profile}
            </Button>
            <Button variant={activeSection === 'password' ? 'secondary' : 'ghost'} className="w-full justify-start text-[#94A3B8] hover:text-[#F1F5F9]" onClick={() => setActiveSection('password')}>
              <Lock className="w-4 h-4 mr-2" />{t.sidebar.password}
            </Button>
            <Button variant={activeSection === 'subscription' ? 'secondary' : 'ghost'} className="w-full justify-start text-[#94A3B8] hover:text-[#F1F5F9]" onClick={() => setActiveSection('subscription')}>
              <CreditCard className="w-4 h-4 mr-2" />{t.sidebar.subscription}
            </Button>
            <Button variant={activeSection === 'danger' ? 'secondary' : 'ghost'} className="w-full justify-start text-[#F59E0B] hover:text-[#F59E0B]" onClick={() => setActiveSection('danger')}>
              <AlertTriangle className="w-4 h-4 mr-2" />{t.sidebar.danger}
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-2xl">
          <h2 className="text-2xl font-bold text-[#F1F5F9] mb-8">{t.title}</h2>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#6366F1] animate-spin" />
            </div>
          ) : (
            <>
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <Card className="bg-[#1A1D27] border-[#2D3348]">
                  <CardHeader>
                    <CardTitle className="text-[#F1F5F9]">{t.profile.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {showSuccess === 'profile' && (
                      <div className="flex items-center gap-2 text-[#10B981] bg-[#10B981]/10 p-3 rounded-lg">
                        <CheckCircle className="w-4 h-4" />{t.profile.successMessage}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label className="text-[#94A3B8]">{t.profile.email}</Label>
                      <Input value={userData?.user.email || ''} disabled className="bg-[#0F1117] border-[#2D3348] text-[#94A3B8]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#94A3B8]">{t.profile.name}</Label>
                      <Input defaultValue="" placeholder={t.profile.namePlaceholder} className="bg-[#0F1117] border-[#2D3348] text-[#F1F5F9]" />
                    </div>
                    <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-[#6366F1] hover:bg-[#6366F1]/80">
                      {isSaving ? t.profile.savingButton : t.profile.saveButton}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Password Section */}
              {activeSection === 'password' && (
                <Card className="bg-[#1A1D27] border-[#2D3348]">
                  <CardHeader>
                    <CardTitle className="text-[#F1F5F9]">{t.password.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {showSuccess === 'password' && (
                      <div className="flex items-center gap-2 text-[#10B981] bg-[#10B981]/10 p-3 rounded-lg">
                        <CheckCircle className="w-4 h-4" />{t.password.successMessage}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label className="text-[#94A3B8]">{t.password.current}</Label>
                      <Input type="password" placeholder={t.password.currentPlaceholder} className="bg-[#0F1117] border-[#2D3348] text-[#F1F5F9]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#94A3B8]">{t.password.new}</Label>
                      <Input type="password" placeholder={t.password.newPlaceholder} className="bg-[#0F1117] border-[#2D3348] text-[#F1F5F9]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#94A3B8]">{t.password.confirm}</Label>
                      <Input type="password" placeholder={t.password.confirmPlaceholder} className="bg-[#0F1117] border-[#2D3348] text-[#F1F5F9]" />
                    </div>
                    <Button onClick={handleChangePassword} disabled={isChangingPassword} className="bg-[#6366F1] hover:bg-[#6366F1]/80">
                      {isChangingPassword ? t.password.changingButton : t.password.changeButton}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Subscription Section */}
              {activeSection === 'subscription' && (
                <Card className="bg-[#1A1D27] border-[#2D3348]">
                  <CardHeader>
                    <CardTitle className="text-[#F1F5F9]">{t.subscription.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#0F1117] rounded-lg">
                      <div>
                        <p className="text-[#94A3B8]">{t.subscription.currentPlan}</p>
                        <p className="text-[#F1F5F9] font-semibold">{planName}</p>
                      </div>
                      <Badge className={subscription ? "bg-[#6366F1]/20 text-[#6366F1]" : "bg-[#94A3B8]/20 text-[#94A3B8]"}>
                        {subscription ? (locale === 'zh-Hans' ? '有效' : 'Active') : (locale === 'zh-Hans' ? '未订阅' : 'No Plan')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#0F1117] rounded-lg">
                      <div>
                        <p className="text-[#94A3B8]">{t.subscription.billingCycle}</p>
                        <p className="text-[#F1F5F9]">{billingCycle}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-[#0F1117] rounded-lg">
                      <div>
                        <p className="text-[#94A3B8]">{t.subscription.nextBilling}</p>
                        <p className="text-[#F1F5F9]">{nextBilling}</p>
                      </div>
                    </div>
                    <Separator className="bg-[#2D3348]" />
                    <div className="flex gap-4">
                      <Link href={`/${locale}/pricing`}>
                        <Button variant="outline" className="border-[#2D3348] text-[#94A3B8] hover:text-[#F1F5F9]">
                          {t.subscription.changePlan}
                        </Button>
                      </Link>
                      {subscription && (
                        <Button variant="ghost" className="text-[#F59E0B] hover:text-[#F59E0B] hover:bg-[#F59E0B]/10">
                          {t.subscription.cancelPlan}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Danger Zone */}
              {activeSection === 'danger' && (
                <Card className="bg-[#1A1D27] border-[#F59E0B]/50">
                  <CardHeader>
                    <CardTitle className="text-[#F59E0B]">{t.danger.title}</CardTitle>
                    <CardDescription className="text-[#94A3B8]">{t.danger.deleteWarning}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="destructive" className="bg-[#EF4444] hover:bg-[#EF4444]/80">
                      {t.danger.deleteButton}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
