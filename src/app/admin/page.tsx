import { AdminPageContent } from '@/components/AdminPageContent';
import { getTranslation } from '@/lib/i18n/translations';

/**
 * 统一后台管理入口
 * 不区分语言，默认使用中文
 */
export default function AdminPage() {
  const translation = getTranslation('zh-Hans');
  return <AdminPageContent translation={translation} locale="zh-Hans" />;
}