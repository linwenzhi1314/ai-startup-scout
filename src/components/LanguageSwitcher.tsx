'use client';

import { usePathname, useRouter } from 'next/navigation';

// 根据路径判断当前语言
function getCurrentLocale(pathname: string): 'zh-Hans' | 'en' {
  if (pathname.startsWith('/en')) {
    return 'en';
  }
  return 'zh-Hans';
}

// 获取切换后的目标路径
function getTargetPath(pathname: string, targetLocale: 'zh-Hans' | 'en'): string {
  const currentLocale = getCurrentLocale(pathname);
  
  // 如果当前是根路径或默认中文路径
  if (pathname === '/' || !pathname.startsWith('/en') && !pathname.startsWith('/zh-Hans')) {
    return targetLocale === 'en' ? '/en' : '/zh-Hans';
  }
  
  // 替换路径中的语言前缀
  if (currentLocale === 'en') {
    // 从 /en/xxx 切换到 /zh-Hans/xxx
    return pathname.replace(/^\/en/, '/zh-Hans');
  } else {
    // 从 /zh-Hans/xxx 切换到 /en/xxx
    return pathname.replace(/^\/zh-Hans/, '/en');
  }
}

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  
  const currentLocale = getCurrentLocale(pathname);
  
  const handleSwitch = () => {
    const targetLocale = currentLocale === 'zh-Hans' ? 'en' : 'zh-Hans';
    const targetPath = getTargetPath(pathname, targetLocale);
    router.push(targetPath);
  };

  return (
    <button
      onClick={handleSwitch}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
      aria-label="Switch language"
    >
      {currentLocale === 'zh-Hans' ? (
        <span>EN</span>
      ) : (
        <span>中文</span>
      )}
    </button>
  );
}