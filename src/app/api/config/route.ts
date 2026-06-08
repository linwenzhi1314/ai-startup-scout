/**
 * @file 配置 API 路由
 * @description 返回后端服务的域名和扩展版本号，供 Chrome 扩展动态获取 API 地址。
 *              扩展启动时调用此接口，避免在后端域名变更时需要手动更新扩展代码。
 * @endpoint GET /api/config
 * @response { apiBase: string, extensionVersion: string }
 */

import { NextResponse } from 'next/server';

/**
 * GET 处理函数：返回后端配置信息
 * - apiBase: 后端服务的完整域名（含协议），从环境变量 COZE_PROJECT_DOMAIN_DEFAULT 读取
 * - extensionVersion: 扩展当前版本号，从 manifest.json 动态读取
 */
export async function GET() {
  // 优先读取 Vercel 环境变量，其次读取沙箱环境变量，最后使用硬编码域名
  const domain =
    process.env.NEXT_PUBLIC_API_BASE_URL ||                    // Vercel 自定义环境变量
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||  // Vercel 自动注入
    process.env.COZE_PROJECT_DOMAIN_DEFAULT ||                 // 沙箱环境变量
    'https://ai-startup-scout.vercel.app';                     // 硬编码回退

  // 读取扩展版本号：从 manifest.json 动态获取
  let extensionVersion = '1.2.1'; // 默认回退值
  try {
    // 使用动态 import 读取 manifest.json 中的 version 字段
    const manifest = await import('../../../../public/extension/manifest.json');
    extensionVersion = manifest.default?.version || manifest.version || '1.2.1';
  } catch {
    // 读取失败时使用默认版本号
  }

  return NextResponse.json({
    apiBase: domain,                 // 后端 API 基地址
    extensionVersion,                // 扩展版本号
  });
}
