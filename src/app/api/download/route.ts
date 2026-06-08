/**
 * @file 扩展下载 API 路由
 * @description 重定向到预打包的 Chrome 扩展 ZIP 静态文件。
 *              ZIP 文件位于 public/ 目录，Vercel 自动作为静态资源部署。
 *              无法在 Vercel Serverless 中通过 fs 读取 public/，因此直接重定向。
 * @endpoint GET /api/download
 * @response 302 重定向到 /ai-startup-scout.zip
 */

import { NextResponse } from 'next/server';

/**
 * GET 处理函数：重定向到扩展 ZIP 静态文件
 */
export async function GET() {
  // Vercel 会自动将 public/ 目录下的文件作为静态资源托管
  // /ai-startup-scout.zip 对应 public/ai-startup-scout.zip
  return NextResponse.redirect(
    new URL('/ai-startup-scout.zip', process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL}`
      : 'https://ai-startup-scout.vercel.app'),
  );
}
