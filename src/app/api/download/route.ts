/**
 * @file 扩展下载 API 路由
 * @description 直接读取 ZIP 文件返回，禁用缓存，确保始终下载最新版
 * @endpoint GET /api/download
 */

import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    // 尝试多个可能的路径读取 ZIP 文件
    const possiblePaths = [
      join(process.cwd(), 'public', 'ai-startup-scout.zip'),
      join('/var/task', 'public', 'ai-startup-scout.zip'),
      join('/var/task', '.next', 'server', 'public', 'ai-startup-scout.zip'),
    ];

    let zipBuffer: Buffer | null = null;
    for (const filePath of possiblePaths) {
      try {
        zipBuffer = await readFile(filePath);
        break;
      } catch {
        // 继续尝试下一个路径
      }
    }

    if (!zipBuffer) {
      // 如果文件系统读取失败，重定向到静态文件并加缓存破坏参数
      const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || 'ai-startup-scout.vercel.app';
      const baseUrl = host.startsWith('http') ? host : `https://${host}`;
      const cacheBuster = Date.now();
      return NextResponse.redirect(`${baseUrl}/ai-startup-scout.zip?t=${cacheBuster}`, 302);
    }

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="ai-startup-scout.zip"',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to download extension' },
      { status: 500 }
    );
  }
}
