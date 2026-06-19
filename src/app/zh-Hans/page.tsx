/**
 * @file zh-Hans 首页重定向
 * @description 动态渲染，重定向到根目录 /
 */

import { redirect } from 'next/navigation';

// 强制动态渲染，跳过静态预渲染
export const dynamic = 'force-dynamic';

export default function ZhHansPage() {
  redirect('/');
}