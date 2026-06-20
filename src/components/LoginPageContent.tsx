'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { useSupabaseConfig } from '@/lib/supabase-config-inject';
import { translations, Locale } from '@/lib/i18n/translations';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface LoginPageContentProps {
  locale: Locale;
}

export default function LoginPageContent({ locale }: LoginPageContentProps) {
  const t = translations[locale].login;
  const router = useRouter();
  const { config, error: configError } = useSupabaseConfig();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 如果配置未加载完成，尝试直接使用浏览器客户端
    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message);
      } else {
        router.push(locale === 'zh-Hans' ? '/zh-Hans/dashboard' : '/en/dashboard');
      }
    } catch (err) {
      setError('Failed to login');
    } finally {
      setLoading(false);
    }
  };

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

        {/* Config Error Warning */}
        {configError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4 text-red-400 text-sm">
            {t.error}: {configError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-[#1A1D27] rounded-xl p-6 space-y-4">
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

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? (locale === 'zh-Hans' ? '登录中...' : 'Logging in...') : t.submitButton}
          </button>

          <div className="text-center text-[#94A3B8] text-sm">
            {t.noAccount}{' '}
            <a href={locale === 'zh-Hans' ? '/zh-Hans/signup' : '/en/signup'} className="text-indigo-400 hover:text-indigo-300">
              {t.signupLink}
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