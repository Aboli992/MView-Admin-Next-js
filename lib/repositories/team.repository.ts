import 'server-only'
import { getAdminSupabase } from '@/lib/supabase/admin'
import { ConflictError, DatabaseError, NotFoundError } from '@/lib/api/errors'
import { logger } from '@/lib/logger'
import type { MineralviewTeamMember } from '@/lib/types'

const TABLE = 'mineralview_team'
const log = logger.child('team.repository')

const UNIQUE_VIOLATION = '23505'
const NOT_FOUND_CODE = 'PGRST116'

export type TeamMemberInsert = Omit<MineralviewTeamMember, 'id' | 'created_at' | 'updated_at'>
export type TeamMemberUpdate = Partial<TeamMemberInsert>

export interface TeamMemberSummary {
  user_id: string
  name: string
}

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

export async function listTeamMembers(): Promise<MineralviewTeamMember[]> {
  const supabase = getAdminSupabase()

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    log.error('list failed', { code: error.code, message: error.message })
    throw new DatabaseError(`Failed to list team members: ${error.message}`)
  }

  return (data ?? []) as MineralviewTeamMember[]
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

export async function findTeamMemberById(
  id: string
): Promise<MineralviewTeamMember | null> {
  const supabase = getAdminSupabase()

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    log.error('findById failed', { id, message: error.message })
    throw new DatabaseError(`Failed to look up team member: ${error.message}`)
  }
  return (data as MineralviewTeamMember | null) ?? null
}

export async function updateTeamMemberById(
  id: string,
  patch: TeamMemberUpdate
): Promise<MineralviewTeamMember> {
  const supabase = getAdminSupabase()

  const { data, error } = await supabase
    .from(TABLE)
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      log.warn('duplicate team member on update', { id, email: patch.email })
      throw new ConflictError(`A team member with email "${patch.email}" already exists`)
    }
    if (error.code === NOT_FOUND_CODE) {
      throw new NotFoundError(`Team member "${id}" not found`)
    }
    log.error('update failed', { id, code: error.code, message: error.message })
    throw new DatabaseError(`Failed to update team member: ${error.message}`)
  }

  return data as MineralviewTeamMember
}

export async function deleteTeamMemberById(id: string): Promise<MineralviewTeamMember> {
  const supabase = getAdminSupabase()

  const { data, error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    if (error.code === NOT_FOUND_CODE) {
      throw new NotFoundError(`Team member "${id}" not found`)
    }
    log.error('delete failed', { id, code: error.code, message: error.message })
    throw new DatabaseError(`Failed to delete team member: ${error.message}`)
  }

  return data as MineralviewTeamMember
}

export async function listTeamMemberSummaries(): Promise<TeamMemberSummary[]> {
  const supabase = getAdminSupabase()

  const { data, error } = await supabase
    .from(TABLE)
    .select('user_id, name')
    .order('name', { ascending: true })

  if (error) {
    log.error('list summaries failed', { code: error.code, message: error.message })
    throw new DatabaseError(`Failed to list team member summaries: ${error.message}`)
  }

  return (data ?? []) as TeamMemberSummary[]
}
