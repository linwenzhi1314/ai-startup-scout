/**
 * @file 扩展下载 API 路由
 * @description 返回预打包的 Chrome 扩展 ZIP 文件供用户下载。
 *              ZIP 文件在构建前已存在于 public/ 目录，Vercel 会自动部署静态资源。
 * @endpoint GET /api/download
 * @response application/zip 文件流
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * GET 处理函数：下载 Chrome 扩展 ZIP
 * 直接读取 public/ai-startup-scout.zip 静态文件返回
 * （Vercel 是只读文件系统，无法运行时执行 zip 命令）
 */
export async function GET() {
  try {
    const zipPath = path.join(process.cwd(), 'public', 'ai-startup-scout.zip');

    // 校验：ZIP 文件必须存在
    if (!fs.existsSync(zipPath)) {
      return NextResponse.json(
        { error: 'Extension ZIP not found' },
        { status: 404 },
      );
    }

    // 读取 ZIP 文件
    const zipBuffer = fs.readFileSync(zipPath);

    // 返回 ZIP 文件流
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="ai-startup-scout.zip"',
      },
    });
  } catch (error) {
    console.error('[Download Error]', error);
    return NextResponse.json(
      { error: 'Failed to download extension' },
      { status: 500 },
    );
  }
}
