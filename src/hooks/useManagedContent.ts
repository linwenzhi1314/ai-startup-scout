'use client';

import { useSiteContent } from '@/hooks/useSiteContent';
import type { Locale } from '@/lib/i18n/translations';

/**
 * Hook that merges database-managed content with hardcoded translations.
 * Database content takes priority; translations serve as fallback.
 * This allows the admin panel to update any section in real-time.
 */
export function useManagedContent<T>(section: string, locale: Locale, fallback: T): {
  data: T;
  loading: boolean;
  error: string | null;
} {
  const { data, loading, error } = useSiteContent<T>(section, locale);
  
  return {
    data: data || fallback,
    loading,
    error,
  };
}
