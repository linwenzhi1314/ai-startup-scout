import { AdminPageContent } from '@/components/AdminPageContent';
import { getTranslation } from '@/lib/i18n/translations';

export default function AdminPage() {
  const translation = getTranslation('en');
  return <AdminPageContent translation={translation} locale="en" />;
}