'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { useSupabaseConfig } from '@/lib/supabase-config-inject';
import { translations, Locale } from '@/lib/i18n/translations';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface SignupPageContentProps {
  locale: Locale;
}

export default function SignupPageContent({ locale }: SignupPageContentProps) {
  const t = translations[locale].signup;
  const router = useRouter();
  const { config, isLoading, error: configError } = useSupabaseConfig();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    if (password !== confirmPassword) {
      setError(locale === 'zh-Hans' ? '两次密码不一致' : 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError(locale === 'zh-Hans' ? '密码至少需要6位' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signupError) {
        setError(signupError.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Failed to signup');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center">
        <div className="text-[#F1F5F9]">{locale === 'zh-Hans' ? '加载中...' : 'Loading...'}</div>
      </div>
    );
  }

  if (configError) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center">
        <div className="text-red-500">{t.error}: {configError}</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-[#1A1D27] rounded-xl p-6">
            <div className="text-green-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#F1F5F9] mb-2">{t.successTitle}</h2>
            <p className="text-[#94A3B8] mb-4">{t.successMessage}</p>
            <a href={locale === 'zh-Hans' ? '/zh-Hans/login' : '/en/login'} className="text-indigo-400 hover:text-indigo-300">
              {t.backToLogin}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1117] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">AI</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#F1F5F9]">{t.title}</h1>
          <p className="text-[#94A3B8] mt-2">{t.subtitle}</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="bg-[#1A1D27] rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-[#F1F5F9] text-sm mb-2">{t.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0F1117] border border-[#2D3348] rounded-lg px-4 py-3 text-[#F1F5F9] focus:border-indigo-500 focus:outline-none"
              placeholder={t.emailPlaceholder}
              required
            />
          </div>
          <div>
            <label className="block text-[#F1F5F9] text-sm mb-2">{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0F1117] border border-[#2D3348] rounded-lg px-4 py-3 text-[#F1F5F9] focus:border-indigo-500 focus:outline-none"
              placeholder={t.passwordPlaceholder}
              required
            />
          </div>
          <div>
            <label className="block text-[#F1F5F9] text-sm mb-2">{t.confirmPassword}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#0F1117] border border-[#2D3348] rounded-lg px-4 py-3 text-[#F1F5F9] focus:border-indigo-500 focus:outline-none"
              placeholder={t.confirmPasswordPlaceholder}
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? (locale === 'zh-Hans' ? '注册中...' : 'Signing up...') : t.submitButton}
          </button>

          <div className="text-center text-[#94A3B8] text-sm">
            {t.hasAccount}{' '}
            <a href={locale === 'zh-Hans' ? '/zh-Hans/login' : '/en/login'} className="text-indigo-400 hover:text-indigo-300">
              {t.loginLink}
            </a>
          </div>
        </form>

        {/* Language Switcher */}
        <div className="mt-6 text-center">
          <LanguageSwitcher />
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <a href={locale === 'zh-Hans' ? '/zh-Hans' : '/en'} className="text-[#94A3B8] hover:text-[#F1F5F9] text-sm">
            {locale === 'zh-Hans' ? '← 返回首页' : '← Back to Home'}
          </a>
        </div>
      </div>
    </div>
  );
}