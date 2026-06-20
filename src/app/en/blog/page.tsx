import { BlogPageContent } from '@/components/BlogPageContent';
import { getTranslation } from '@/lib/i18n/translations';

export default function BlogPage() {
  const translation = getTranslation('en');
  return <BlogPageContent translation={translation} locale="en" />;
}