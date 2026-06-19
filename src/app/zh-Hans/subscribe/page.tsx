/**
 * @file zh-Hans 订阅页重定向
 * @description 动态渲染，重定向到 /subscribe
 */

import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function ZhHansSubscribePage() {
  redirect('/subscribe');
}