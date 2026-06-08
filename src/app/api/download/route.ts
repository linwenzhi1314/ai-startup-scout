/**
 * @file 扩展下载 API 路由
 * @description 重定向到版本化 ZIP 文件，绕过 Vercel CDN 缓存
 * @endpoint GET /api/download
 */

import { NextResponse } from 'next/server';

export async function GET() {
  // 读取 manifest.json 获取当前版本号
  const manifestUrl = `${process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || 'ai-startup-scout.vercel.app'}`;
  const baseUrl = manifestUrl.startsWith('http') ? manifestUrl : `https://${manifestUrl}`;
  
  // 直接重定向到主 ZIP 文件
  return NextResponse.redirect(`${baseUrl}/ai-startup-scout.zip`, 302);
}
