'use client';

import { useState } from 'react';
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
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { Translation } from '@/lib/i18n/translations';

interface SettingsPageContentProps {
  translation: Translation;
  locale: string;
}

export function SettingsPageContent({ translation, locale }: SettingsPageContentProps) {
  const t = translation.settings;
  const [activeSection, setActiveSection] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  // Mock data - will be replaced with real data from Supabase
  const mockUser = {
    email: 'user@example.com',
    name: '用户名'
  };

  const mockSubscription = {
    plan: '专业版',
    billingCycle: '每月',
    nextBilling: '2024-07-01'
  };

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
            <Button
              variant={activeSection === 'profile' ? 'secondary' : 'ghost'}
              className="w-full justify-start text-[#94A3B8] hover:text-[#F1F5F9]"
              onClick={() => setActiveSection('profile')}
            >
              <User className="w-4 h-4 mr-2" />
              {t.sidebar.profile}
            </Button>
            <Button
              variant={activeSection === 'password' ? 'secondary' : 'ghost'}
              className="w-full justify-start text-[#94A3B8] hover:text-[#F1F5F9]"
              onClick={() => setActiveSection('password')}
            >
              <Lock className="w-4 h-4 mr-2" />
              {t.sidebar.password}
            </Button>
            <Button
              variant={activeSection === 'subscription' ? 'secondary' : 'ghost'}
              className="w-full justify-start text-[#94A3B8] hover:text-[#F1F5F9]"
              onClick={() => setActiveSection('subscription')}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {t.sidebar.subscription}
            </Button>
            <Button
              variant={activeSection === 'danger' ? 'secondary' : 'ghost'}
              className="w-full justify-start text-[#F59E0B] hover:text-[#F59E0B]"
              onClick={() => setActiveSection('danger')}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              {t.sidebar.danger}
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-2xl">
          <h2 className="text-2xl font-bold text-[#F1F5F9] mb-8">{t.title}</h2>

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <Card className="bg-[#1A1D27] border-[#2D3348]">
              <CardHeader>
                <CardTitle className="text-[#F1F5F9]">{t.profile.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {showSuccess === 'profile' && (
                  <div className="flex items-center gap-2 text-[#10B981] bg-[#10B981]/10 p-3 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    {t.profile.successMessage}
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-[#94A3B8]">{t.profile.email}</Label>
                  <Input
                    value={mockUser.email}
                    disabled
                    className="bg-[#0F1117] border-[#2D3348] text-[#94A3B8]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#94A3B8]">{t.profile.name}</Label>
                  <Input
                    defaultValue={mockUser.name}
                    placeholder={t.profile.namePlaceholder}
                    className="bg-[#0F1117] border-[#2D3348] text-[#F1F5F9]"
                  />
                </div>
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-[#6366F1] hover:bg-[#6366F1]/80"
                >
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
                    <CheckCircle className="w-4 h-4" />
                    {t.password.successMessage}
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-[#94A3B8]">{t.password.current}</Label>
                  <Input
                    type="password"
                    placeholder={t.password.currentPlaceholder}
                    className="bg-[#0F1117] border-[#2D3348] text-[#F1F5F9]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#94A3B8]">{t.password.new}</Label>
                  <Input
                    type="password"
                    placeholder={t.password.newPlaceholder}
                    className="bg-[#0F1117] border-[#2D3348] text-[#F1F5F9]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#94A3B8]">{t.password.confirm}</Label>
                  <Input
                    type="password"
                    placeholder={t.password.confirmPlaceholder}
                    className="bg-[#0F1117] border-[#2D3348] text-[#F1F5F9]"
                  />
                </div>
                <Button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className="bg-[#6366F1] hover:bg-[#6366F1]/80"
                >
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
                    <p className="text-[#F1F5F9] font-semibold">{mockSubscription.plan}</p>
                  </div>
                  <Badge className="bg-[#6366F1]/20 text-[#6366F1]">有效</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#0F1117] rounded-lg">
                  <div>
                    <p className="text-[#94A3B8]">{t.subscription.billingCycle}</p>
                    <p className="text-[#F1F5F9]">{mockSubscription.billingCycle}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#0F1117] rounded-lg">
                  <div>
                    <p className="text-[#94A3B8]">{t.subscription.nextBilling}</p>
                    <p className="text-[#F1F5F9]">{mockSubscription.nextBilling}</p>
                  </div>
                </div>
                <Separator className="bg-[#2D3348]" />
                <div className="flex gap-4">
                  <Link href={`/${locale}/pricing`}>
                    <Button variant="outline" className="border-[#2D3348] text-[#94A3B8] hover:text-[#F1F5F9]">
                      {t.subscription.changePlan}
                    </Button>
                  </Link>
                  <Button variant="ghost" className="text-[#F59E0B] hover:text-[#F59E0B] hover:bg-[#F59E0B]/10">
                    {t.subscription.cancelPlan}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Danger Zone */}
          {activeSection === 'danger' && (
            <Card className="bg-[#1A1D27] border-[#F59E0B]/50">
              <CardHeader>
                <CardTitle className="text-[#F59E0B]">{t.danger.title}</CardTitle>
                <CardDescription className="text-[#94A3B8]">
                  {t.danger.deleteWarning}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="bg-[#EF4444] hover:bg-[#EF4444]/80">
                  {t.danger.deleteButton}
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}