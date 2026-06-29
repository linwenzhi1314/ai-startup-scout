'use client';

import { useState, useEffect, useCallback } from 'react';
import { translations } from '@/lib/i18n/translations';
import type { Locale } from '@/lib/i18n/translations';

// Cache for site content to avoid redundant fetches
const contentCache: Record<string, { data: unknown; timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch site content from database, with fallback to hardcoded translations.
 * This ensures the site always works even if the database is down.
 */
export function useSiteContent<T>(section: string, locale: Locale): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cacheKey = `${section}:${locale}`;
      const cached = contentCache[cacheKey];
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setData(cached.data as T);
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/content?section=${section}&locale=${locale}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.content) {
          // Cache the database content
          contentCache[cacheKey] = { data: result.content, timestamp: Date.now() };
          setData(result.content as T);
          setLoading(false);
          return;
        }
      }

      // Fallback to translations.ts
      const fallbackData = getFallbackContent(section, locale);
      setData(fallbackData as T);
    } catch (err) {
      // Fallback to translations.ts on error
      const fallbackData = getFallbackContent(section, locale);
      setData(fallbackData as T);
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  }, [section, locale]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Get fallback content from hardcoded translations
 */
function getFallbackContent(section: string, locale: Locale): unknown {
  const translation = translations[locale];
  if (!translation) return null;

  // Map section names to translation keys
  const sectionMap: Record<string, string> = {
    pricing: 'pricing',
    hero: 'hero',
    features: 'features',
    howItWorks: 'howItWorks',
    about: 'about',
    help: 'help',
    blog: 'blog',
    terms: 'terms',
    privacy: 'privacy',
    subscribe: 'subscribe',
  };

  const key = sectionMap[section];
  if (!key) return null;

  return (translation as unknown as Record<string, unknown>)[key] || null;
}

/**
 * Server-side function to get site content (for SSR)
 */
export async function getSiteContent<T>(section: string, locale: Locale): Promise<T | null> {
  try {
    // In server context, we read from the database directly
    const { getSupabaseClient } = await import('@/lib/supabase');
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('section', section)
      .single();

    if (!error && data?.content?.[locale]) {
      return data.content[locale] as T;
    }
  } catch {
    // Fall through to fallback
  }

  // Fallback
  const translation = translations[locale];
  if (!translation) return null;

  const sectionMap: Record<string, string> = {
    pricing: 'pricing',
    hero: 'hero',
    features: 'features',
    howItWorks: 'howItWorks',
    about: 'about',
    help: 'help',
    blog: 'blog',
    terms: 'terms',
    privacy: 'privacy',
    subscribe: 'subscribe',
  };

  const key = sectionMap[section];
  if (!key) return null;

  return ((translation as unknown as Record<string, unknown>)[key] as T) || null;
}

/**
 * Invalidate content cache (call after admin updates)
 */
export function invalidateContentCache(section?: string) {
  if (section) {
    // Invalidate specific section
    Object.keys(contentCache).forEach((key) => {
      if (key.startsWith(`${section}:`)) {
        delete contentCache[key];
      }
    });
  } else {
    // Invalidate all
    Object.keys(contentCache).forEach((key) => {
      delete contentCache[key];
    });
  }
}
