import { createClient } from '@supabase/supabase-js';

let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient;
  }

  const config = (window as unknown as { __SUPABASE_CONFIG__?: { url: string; anonKey: string } }).__SUPABASE_CONFIG__;
  
  if (!config?.url || !config?.anonKey) {
    throw new Error('Supabase config not loaded. Make sure SupabaseConfigProvider is mounted.');
  }

  browserClient = createClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  return browserClient;
}