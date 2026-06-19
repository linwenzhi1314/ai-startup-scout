'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

/**
 * 语言切换组件
 * 支持中英文切换，并存储用户偏好到 Cookie
 */
export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  // 获取当前语言
  const getCurrentLocale = useCallback(() => {
    if (pathname.startsWith('/en')) return 'en';
    return 'zh-Hans';
  }, [pathname]);

  // 计算目标语言路径
  const getTargetPath = useCallback((currentPath: string, targetLocale: string) => {
    const currentLocale = getCurrentLocale();
    
    // 如果当前在根路径，直接跳转到目标语言路径
    if (currentPath === '/' || currentPath === '') {
      return `/${targetLocale}`;
    }
    
    // 替换语言前缀
    if (currentLocale === 'zh-Hans') {
      // 中文路径，切换到英文：去掉 /zh-Hans 前缀，添加 /en
      const pathWithoutLocale = currentPath.replace(/^\/zh-Hans/, '') || '/';
      return `/en${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    } else {
      // 英文路径，切换到中文：去掉 /en 前缀，添加 /zh-Hans
      const pathWithoutLocale = currentPath.replace(/^\/en/, '') || '/';
      return `/zh-Hans${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    }
  }, [getCurrentLocale]);

  const currentLocale = getCurrentLocale();

  const handleSwitch = useCallback(() => {
    const targetLocale = currentLocale === 'zh-Hans' ? 'en' : 'zh-Hans';
    const targetPath = getTargetPath(pathname, targetLocale);
    
    // 存储 Cookie（有效期 1 年）
    document.cookie = `locale=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // 跳转到目标路径
    router.push(targetPath);
  }, [currentLocale, pathname, getTargetPath, router]);

  return (
    <button
      onClick={handleSwitch}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
      aria-label="切换语言"
    >
      <span>{currentLocale === 'zh-Hans' ? 'EN' : '中文'}</span>
    </button>
  );
}