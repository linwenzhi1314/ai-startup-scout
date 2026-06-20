/**
 * @file 英文版首页 (en)
 * @description 使用共享首页组件，传入英文翻译配置
 */

import { HomePageContent } from '@/components/HomePageContent';
import { getTranslation } from '@/lib/i18n/translations';

export default function EnglishHomePage() {
  const t = getTranslation('en');
  return <HomePageContent locale="en" t={t} />;
}