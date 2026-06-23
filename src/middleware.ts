import { NextRequest, NextResponse } from 'next/server';

// 支持的语言列表
const locales = ['zh-Hans', 'en'];
const defaultLocale = 'zh-Hans';

// 不需要语言重定向的统一路径（后台管理等）
const unifiedPaths = ['/admin', '/dashboard'];

// 获取用户偏好语言
function getLocaleFromRequest(request: NextRequest): string {
  // 1. 检查 Cookie 中是否有用户手动设置的语言偏好
  const cookieLocale = request.cookies.get('locale')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 2. 检查浏览器 Accept-Language 头
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    // 解析 Accept-Language 头，按优先级排序
    // 格式: "zh-CN,zh;q=0.9,en;q=0.8"
    const languages = acceptLanguage
      .split(',')
      .map(lang => {
        const [code, q] = lang.split(';q=');
        return { code: code.trim().toLowerCase(), q: q ? parseFloat(q) : 1 };
      })
      .sort((a, b) => b.q - a.q);

    // 匹配支持的语言
    for (const lang of languages) {
      if (lang.code.startsWith('zh')) {
        return 'zh-Hans';
      }
      if (lang.code.startsWith('en')) {
        return 'en';
      }
    }
  }

  // 3. 默认语言
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 静态资源、API、_next 等路径不处理
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  // 统一路径（后台管理等）不进行语言重定向
  if (unifiedPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }

  // 如果已经是语言路径，不重定向
  const isLocalePath = locales.some(
    locale => pathname.startsWith(`/${locale}`) || pathname === `/${locale}`
  );

  if (isLocalePath) {
    return NextResponse.next();
  }

  // 根路径或非语言路径，重定向到对应语言版本
  const locale = getLocaleFromRequest(request);
  const url = request.nextUrl.clone();
  
  // 重定向到语言路径
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  
  return NextResponse.redirect(url);
}

export const config = {
  // 匹配所有路径，排除静态资源和 API
  matcher: ['/((?!_next|api|favicon|.*\\..*).*)'],
};