/**
 * @file Next.js 中间件
 * @description 统一处理 API 路由的 CORS 响应头，允许 Chrome 扩展跨域请求。
 *              Chrome 扩展的 popup.html 发起 fetch 请求时，origin 为扩展自身，
 *              需要后端显式允许跨域访问。
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 允许跨域访问的来源列表
 * - chrome-extension://：允许所有 Chrome 扩展
 * - null：扩展 popup 在某些情况下 origin 为 null
 * - 开发环境 localhost
 */
const ALLOWED_ORIGINS = [
  'chrome-extension://',
  'null',
  'http://localhost:5000',
  'http://localhost:3000',
];

export function middleware(request: NextRequest) {
  // 只处理 API 路由
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // 处理 OPTIONS 预检请求
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    setCorsHeaders(response, request);
    return response;
  }

  // 处理正常请求：先执行后续逻辑，再添加 CORS 头
  const response = NextResponse.next();
  setCorsHeaders(response, request);
  return response;
}

/**
 * 为响应添加 CORS 头
 * @param response - Next.js 响应对象
 * @param request - Next.js 请求对象（用于获取 origin）
 */
function setCorsHeaders(response: NextResponse, request: NextRequest) {
  const origin = request.headers.get('origin') || '';

  // 判断来源是否允许：扩展 origin 或开发环境
  const isAllowed = ALLOWED_ORIGINS.some(
    (allowed) => origin.startsWith(allowed) || (!origin && allowed === 'null'),
  );

  // 允许的来源：匹配则返回具体 origin，否则返回 *（兼容无 origin 的请求）
  response.headers.set('Access-Control-Allow-Origin', isAllowed ? origin : '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-session');
  response.headers.set('Access-Control-Max-Age', '86400'); // 预检缓存 24 小时
}

// 匹配所有 API 路由
export const config = {
  matcher: '/api/:path*',
};
