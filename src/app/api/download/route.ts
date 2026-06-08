/**
 * @file 扩展下载 API 路由
 * @description 返回预打包的 Chrome 扩展 ZIP 文件供下载。
 *              ZIP 文件位于 public/ 目录，构建时会被复制到输出目录。
 * @endpoint GET /api/download
 * @response application/zip 文件流
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * GET 处理函数：下载 Chrome 扩展 ZIP
 * 尝试多个可能的路径读取 ZIP 文件（兼容本地开发和 Vercel 部署）
 */
export async function GET() {
  // 可能的 ZIP 文件路径（按优先级尝试）
  const possiblePaths = [
    path.join(process.cwd(), 'public', 'ai-startup-scout.zip'),          // 标准路径
    path.join(process.cwd(), '.next', 'static', 'ai-startup-scout.zip'),  // Next.js 构建输出
    path.join(process.cwd(), 'ai-startup-scout.zip'),                     // 根目录
  ];

  for (const zipPath of possiblePaths) {
    try {
      if (fs.existsSync(zipPath)) {
        const zipBuffer = fs.readFileSync(zipPath);
        return new NextResponse(zipBuffer, {
          headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename="ai-startup-scout.zip"',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
    } catch {
      // 继续尝试下一个路径
    }
  }

  // 所有路径都找不到，返回错误并附加上下文信息方便调试
  return NextResponse.json(
    { error: 'Extension ZIP not found', cwd: process.cwd() },
    { status: 404 },
  );
}
