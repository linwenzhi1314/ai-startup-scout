import { SettingsPageContent } from '@/components/SettingsPageContent';
import { getTranslation } from '@/lib/i18n/translations';

export default function SettingsPage() {
  const translation = getTranslation('en');
  return <SettingsPageContent translation={translation} locale="en" />;
}