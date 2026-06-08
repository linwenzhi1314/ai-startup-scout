/**
 * @file 扩展下载 API 路由
 * @description 读取预打包的 Chrome 扩展 ZIP 文件供下载
 * @endpoint GET /api/download
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const possiblePaths = [
    path.join(process.cwd(), 'public', 'ai-startup-scout.zip'),
    path.join(process.cwd(), '.next', 'static', 'ai-startup-scout.zip'),
    path.join(process.cwd(), 'ai-startup-scout.zip'),
  ];

  for (const zipPath of possiblePaths) {
    try {
      if (fs.existsSync(zipPath)) {
        const zipBuffer = fs.readFileSync(zipPath);
        return new NextResponse(zipBuffer, {
          headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename="ai-startup-scout.zip"',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
      }
    } catch {
      // 继续尝试下一个路径
    }
  }

  // 列出目录内容方便调试
  let debugInfo = `cwd: ${process.cwd()}\n`;
  try {
    const publicDir = path.join(process.cwd(), 'public');
    if (fs.existsSync(publicDir)) {
      debugInfo += `public/: ${fs.readdirSync(publicDir).join(', ')}\n`;
    }
  } catch { /* ignore */ }

  return NextResponse.json(
    { error: 'Extension ZIP not found', debug: debugInfo },
    { status: 404 },
  );
}
