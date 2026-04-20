import 'server-only'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { DatabaseError } from '@/lib/api/errors'
import { logger } from '@/lib/logger'
import type { DailyUpdate } from '@/lib/types'

const TABLE = 'daily_updates'
const log = logger.child('daily-update.repository')

export type DailyUpdateInsert = Omit<DailyUpdate, 'id' | 'created_at' | 'updated_at'>

export async function insertDailyUpdate(payload: DailyUpdateInsert): Promise<DailyUpdate> {
  const supabase = getAdminSupabase()

  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    log.error('insert failed', { code: error.code, message: error.message })
    throw new DatabaseError(`Failed to create daily update: ${error.message}`)
  }

  return data as DailyUpdate
}

export async function listDailyUpdatesBySubmissionDate(
  submissionDate: string
): Promise<DailyUpdate[]> {
  const supabase = getAdminSupabase()

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('submission_date', submissionDate)
    .order('created_at', { ascending: false })

  if (error) {
    log.error('list by date failed', { code: error.code, message: error.message })
    throw new DatabaseError(`Failed to list daily updates: ${error.message}`)
  }

  return (data ?? []) as DailyUpdate[]
}
