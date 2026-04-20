import 'server-only'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'

let client: SupabaseClient | null = null

export function getAdminSupabase(): SupabaseClient {
  if (client) return client

  const key = env.SUPABASE_SERVICE_ROLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    logger.warn(
      'SUPABASE_SERVICE_ROLE_KEY is not set — admin operations will run under the publishable key and will be subject to RLS'
    )
  }

  client = createClient(env.NEXT_PUBLIC_SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'X-Client-Info': 'mview-admin-server' } },
  })
  return client
}

export const TEAM_BUCKET = env.SUPABASE_TEAM_BUCKET
export const RESUME_FOLDER = env.SUPABASE_RESUME_FOLDER
