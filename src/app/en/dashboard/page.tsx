import { DashboardPageContent } from '@/components/DashboardPageContent';
import { getTranslation } from '@/lib/i18n/translations';

export default function DashboardPage() {
  const translation = getTranslation('en');
  return <DashboardPageContent translation={translation} locale="en" />;
}