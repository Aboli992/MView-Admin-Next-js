import 'server-only'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { ConflictError, DatabaseError } from '@/lib/api/errors'
import { logger } from '@/lib/logger'
import type { MineralviewTeamMember } from '@/lib/types'

const TABLE = 'mineralview_team'
const log = logger.child('team.repository')

const UNIQUE_VIOLATION = '23505'

export type TeamMemberInsert = Omit<MineralviewTeamMember, 'id' | 'created_at' | 'updated_at'>

export async function insertTeamMember(
  payload: TeamMemberInsert
): Promise<MineralviewTeamMember> {
  const supabase = getAdminSupabase()

  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      log.warn('duplicate team member', { email: payload.email })
      throw new ConflictError(`A team member with email "${payload.email}" already exists`)
    }
    log.error('insert failed', { code: error.code, message: error.message })
    throw new DatabaseError(`Failed to create team member: ${error.message}`)
  }

  return data as MineralviewTeamMember
}

export async function findTeamMemberByEmail(
  email: string
): Promise<MineralviewTeamMember | null> {
  const supabase = getAdminSupabase()

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('email', email)
    .maybeSingle()

  if (error) {
    log.error('findByEmail failed', { message: error.message })
    throw new DatabaseError(`Failed to look up team member: ${error.message}`)
  }
  return (data as MineralviewTeamMember | null) ?? null
}
