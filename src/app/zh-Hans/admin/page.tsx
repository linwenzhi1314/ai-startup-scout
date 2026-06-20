import { AdminPageContent } from '@/components/AdminPageContent';
import { getTranslation } from '@/lib/i18n/translations';

export default function AdminPage() {
  const translation = getTranslation('zh-Hans');
  return <AdminPageContent translation={translation} locale="zh-Hans" />;
}