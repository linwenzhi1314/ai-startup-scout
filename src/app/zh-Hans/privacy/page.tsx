/**
 * @file zh-Hans 隐私政策重定向
 * @description 动态渲染，重定向到 /privacy
 */

import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function ZhHansPrivacyPage() {
  redirect('/privacy');
}