import { BlogPageContent } from '@/components/BlogPageContent';
import { getTranslation } from '@/lib/i18n/translations';

export default function BlogPage() {
  const translation = getTranslation('zh-Hans');
  return <BlogPageContent translation={translation} locale="zh-Hans" />;
}