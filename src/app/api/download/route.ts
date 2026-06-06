/**
 * @file 扩展下载 API 路由
 * @description 动态打包 Chrome 扩展文件为 ZIP 并返回下载流。
 *              每次请求时实时打包 public/extension/ 目录，确保下载的是最新版本。
 * @endpoint GET /api/download
 * @response application/zip 文件流
 */

import { NextResponse } from 'next/server';
import { execSync } from 'child_process'; // 同步执行 shell 命令
import path from 'path';                  // 路径处理
import fs from 'fs';                      // 文件系统操作

/**
 * GET 处理函数：打包并下载 Chrome 扩展 ZIP
 * 1. 检查扩展源文件目录是否存在
 * 2. 使用系统 zip 命令实时打包
 * 3. 读取 ZIP 文件并以流方式返回
 */
export async function GET() {
  // 扩展源文件目录：public/extension/
  const extensionDir = path.join(process.cwd(), 'public', 'extension');

  // 校验：扩展目录必须存在
  if (!fs.existsSync(extensionDir)) {
    return NextResponse.json(
      { error: 'Extension directory not found' },
      { status: 404 }, // 404 Not Found
    );
  }

  try {
    // ZIP 输出路径：public/ai-startup-scout.zip
    const zipPath = path.join(process.cwd(), 'public', 'ai-startup-scout.zip');

    // 执行 zip 命令：进入扩展目录，递归打包所有文件到指定路径
    // -r: 递归打包子目录
    execSync(`cd ${extensionDir} && zip -r ${zipPath} .`, { stdio: 'pipe' });

    // 同步读取生成的 ZIP 文件为 Buffer
    const zipBuffer = fs.readFileSync(zipPath);

    // 返回 ZIP 文件流
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',                              // ZIP 文件类型
        'Content-Disposition': 'attachment; filename="ai-startup-scout.zip"', // 下载文件名
      },
    });
  } catch (error) {
    // 捕获打包或读取异常
    console.error('[Download Error]', error);
    return NextResponse.json(
      { error: 'Failed to package extension' },
      { status: 500 }, // 500 Internal Server Error
    );
  }
}
