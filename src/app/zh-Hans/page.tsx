/**
 * @file 中文版首页 (zh-Hans)
 * @description 使用共享首页组件，传入中文翻译配置
 */

import { HomePageContent } from '@/components/HomePageContent';
import { getTranslation } from '@/lib/i18n/translations';

export default function ChineseHomePage() {
  const t = getTranslation('zh-Hans');
  return <HomePageContent locale="zh-Hans" t={t} />;
}