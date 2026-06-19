/**
 * @file zh-Hans 支持页重定向
 * @description 动态渲染，重定向到 /support
 */

import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function ZhHansSupportPage() {
  redirect('/support');
}