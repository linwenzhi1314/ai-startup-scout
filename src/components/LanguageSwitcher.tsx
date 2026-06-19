'use client';

import { usePathname, useRouter } from 'next/navigation';

// 根据路径判断当前语言
function getCurrentLocale(pathname: string): 'zh' | 'en' {
  if (pathname.startsWith('/en')) {
    return 'en';
  }
  return 'zh'; // 根目录 / 及其他路径视为中文
}

// 获取切换后的目标路径
function getTargetPath(pathname: string, targetLocale: 'zh' | 'en'): string {
  const currentLocale = getCurrentLocale(pathname);
  
  if (currentLocale === 'en') {
    // 从 /en/xxx 切换到 /xxx（根路径）
    const path = pathname.replace(/^\/en/, '') || '/';
    return path;
  } else {
    // 从 /xxx 切换到 /en/xxx
    if (pathname === '/') {
      return '/en';
    }
    return `/en${pathname}`;
  }
}

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  
  const currentLocale = getCurrentLocale(pathname);
  
  const handleSwitch = () => {
    const targetLocale = currentLocale === 'zh' ? 'en' : 'zh';
    const targetPath = getTargetPath(pathname, targetLocale);
    router.push(targetPath);
  };

  return (
    <button
      onClick={handleSwitch}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
      aria-label="Switch language"
    >
      {currentLocale === 'zh' ? (
        <span>EN</span>
      ) : (
        <span>中文</span>
      )}
    </button>
  );
}