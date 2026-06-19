/**
 * @file 根路径首页 - 语言检测入口
 * @description 此页面由 middleware 自动重定向到对应语言版本
 *              预渲染时直接重定向到默认语言（中文）
 */

import { redirect } from 'next/navigation';

// 强制动态渲染，让 middleware 在请求时执行
export const dynamic = 'force-dynamic';

export default function RootPage() {
  // 预渲染时重定向到默认语言
  redirect('/zh-Hans');
}