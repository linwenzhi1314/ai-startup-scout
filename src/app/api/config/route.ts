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
  // 读取沙箱环境变量中的项目域名（已含 https:// 前缀）
  const domain = process.env.COZE_PROJECT_DOMAIN_DEFAULT || '';

  // 读取扩展版本号：从 manifest.json 动态获取
  let extensionVersion = '1.2.0'; // 默认回退值
  try {
    // 使用动态 import 读取 manifest.json 中的 version 字段
    const manifest = await import('../../../../public/extension/manifest.json');
    extensionVersion = manifest.default?.version || manifest.version || '1.2.0';
  } catch {
    // 读取失败时使用默认版本号
  }

  return NextResponse.json({
    apiBase: domain || '',            // 后端 API 基地址
    extensionVersion,                 // 扩展版本号
  });
}
