import 'server-only'
import { getAdminSupabase, TEAM_BUCKET } from '@/lib/supabase/admin'
import { listTeamMembers } from '@/lib/repositories/team.repository'
import { listAllDailyUpdates } from '@/lib/repositories/daily-update.repository'
import { logger } from '@/lib/logger'
import type { DailyUpdate, MineralviewTeamMember } from '@/lib/types'

const log = logger.child('files.service')

export interface ResumeFileRow {
  member_id: string | null
  name: string
  role: string | null
  email: string | null
  team: string
  tags: string[]
  resume_status: MineralviewTeamMember['resume_status']
  path: string | null
  url: string | null
  filename: string | null
  uploaded_at: string | null
}

export interface DailyUpdateAttachmentRow {
  update_id: number | null
  user_id: string | null
  member_id: string | null
  name: string
  role: string | null
  team: string
  tags: string[]
  submission_date: string
  filename: string | null
  mime: string | null
  size: number | null
  url: string
  uploaded_at: string | null
}

function teamLabelFromTags(tags: string[] | undefined): string {
  if (!tags || tags.length === 0) return '—'
  return tags.join(', ')
}

function publicUrlForResume(path: string): string | null {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  const supabase = getAdminSupabase()
  const { data } = supabase.storage.from(TEAM_BUCKET).getPublicUrl(path)
  return data?.publicUrl ?? null
}

function filenameFromPath(value: string | null): string | null {
  if (!value) return null
  try {
    const withoutQuery = value.split('?')[0]
    const segments = withoutQuery.split('/').filter(Boolean)
    return segments[segments.length - 1] ?? null
  } catch {
    return null
  }
}

export async function listAllResumes(): Promise<ResumeFileRow[]> {
  const members = await listTeamMembers()

  const rows: ResumeFileRow[] = members.map((m) => {
    const path = m.resume ?? null
    const url = path ? publicUrlForResume(path) : null
    return {
      member_id: m.id ?? null,
      name: m.name,
      role: m.role ?? null,
      email: m.email ?? null,
      team: teamLabelFromTags(m.tags),
      tags: m.tags ?? [],
      resume_status: m.resume_status ?? (path ? 'uploaded' : 'missing'),
      path,
      url,
      filename: filenameFromPath(path),
      uploaded_at: m.updated_at ?? m.created_at ?? null,
    }
  })

  rows.sort((a, b) => {
    const aHas = a.url ? 0 : 1
    const bHas = b.url ? 0 : 1
    if (aHas !== bHas) return aHas - bHas
    return a.name.localeCompare(b.name)
  })

  log.info('resumes listed', {
    total: rows.length,
    uploaded: rows.filter((r) => r.url).length,
  })

  return rows
}

export async function listAllDailyUpdateAttachments(): Promise<DailyUpdateAttachmentRow[]> {
  const [updates, members] = await Promise.all([
    listAllDailyUpdates(),
    listTeamMembers(),
  ])

  const memberByUserId = new Map<string, MineralviewTeamMember>()
  for (const m of members) {
    const maybeUserId = (m as MineralviewTeamMember & { user_id?: string | number }).user_id
    if (maybeUserId !== null && maybeUserId !== undefined) {
      memberByUserId.set(String(maybeUserId), m)
    }
  }

  const withAttachments = updates.filter(
    (u): u is DailyUpdate & { attachment_path: string } =>
      Boolean(u.attachment_path)
  )

  const rows: DailyUpdateAttachmentRow[] = withAttachments.map((u) => {
    const userKey = String(u.user_id)
    const member = memberByUserId.get(userKey) ?? null
    return {
      update_id: u.id ?? null,
      user_id: userKey,
      member_id: member?.id ?? null,
      name: member?.name ?? u.user_name,
      role: member?.role ?? null,
      team: teamLabelFromTags(member?.tags),
      tags: member?.tags ?? [],
      submission_date: u.submission_date,
      filename:
        u.attachment_original_name ?? filenameFromPath(u.attachment_path),
      mime: u.attachment_mime_type ?? null,
      size: u.attachment_size ?? null,
      url: u.attachment_path,
      uploaded_at: u.created_at ?? null,
    }
  })

  rows.sort((a, b) => {
    if (a.submission_date !== b.submission_date) {
      return b.submission_date.localeCompare(a.submission_date)
    }
    return (b.uploaded_at ?? '').localeCompare(a.uploaded_at ?? '')
  })

  log.info('daily update attachments listed', {
    total_updates: updates.length,
    with_attachments: rows.length,
  })

  return rows
}
