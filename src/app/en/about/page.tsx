import { AboutPageContent } from '@/components/AboutPageContent';
import { getTranslation } from '@/lib/i18n/translations';

export default function AboutPage() {
  const translation = getTranslation('en');
  return <AboutPageContent translation={translation} locale="en" />;
}