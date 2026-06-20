import { HelpPageContent } from '@/components/HelpPageContent';
import { getTranslation } from '@/lib/i18n/translations';

export default function HelpPage() {
  const translation = getTranslation('en');
  return <HelpPageContent translation={translation} locale="en" />;
}