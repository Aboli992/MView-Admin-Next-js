import 'server-only'
import {
  listAllDailyUpdates,
  listDailyUpdatesByDateRange,
} from '@/lib/repositories/daily-update.repository'
import { listTeamMembers } from '@/lib/repositories/team.repository'
import { logger } from '@/lib/logger'
import type { DailyUpdate, MineralviewTeamMember } from '@/lib/types'

const log = logger.child('weekly-report.service')

export type WeeklyMemberStatus =
  | 'aligned'
  | 'has_blockers'
  | 'no_update'
  | 'on_leave'
  | 'onboarding'
  | 'inactive'

export interface WeeklyMemberRow {
  member_id: string | null
  user_id: string | null
  name: string
  email: string | null
  role: string | null
  team: string
  tags: string[]
  member_status: MineralviewTeamMember['status'] | null
  update_count: number
  this_week: string
  next_week: string
  has_blockers: boolean
  blocker_notes: string
  status: WeeklyMemberStatus
  last_submitted_at: string | null
  updates: DailyUpdate[]
}

export interface WeeklySummary {
  updates_submitted: number
  aligned: number
  constitution_signals: number
  no_update: number
  on_leave: number
}

export interface WeeklyReportSection {
  week_start: string
  week_end: string
  summary: WeeklySummary
  members: WeeklyMemberRow[]
}

export interface AllSavedSection {
  summary: {
    total_updates: number
    unique_members: number
    earliest: string | null
    latest: string | null
    weeks_covered: number
  }
  weeks: Array<{
    week_start: string
    week_end: string
    updates_submitted: number
    unique_members: number
  }>
}

export interface WeeklyReport {
  generated_at: string
  current_week: WeeklyReportSection
  previous_week: WeeklyReportSection
  all_saved: AllSavedSection
}

function formatLocalIso(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function parseIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

function addDaysIso(iso: string, days: number): string {
  const d = parseIso(iso)
  d.setDate(d.getDate() + days)
  return formatLocalIso(d)
}

function getMondayIso(date: Date): string {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return formatLocalIso(d)
}

function joinNonEmpty(parts: string[], sep: string): string {
  return parts.map((p) => (p ?? '').trim()).filter(Boolean).join(sep)
}

function teamLabelFromTags(tags: string[] | undefined): string {
  if (!tags || tags.length === 0) return '—'
  return tags.join(', ')
}

function buildMemberKey(userId: unknown): string | null {
  if (userId === null || userId === undefined) return null
  return String(userId)
}

function deriveStatus(
  hasUpdate: boolean,
  hasBlockers: boolean,
  memberStatus: MineralviewTeamMember['status'] | null
): WeeklyMemberStatus {
  if (memberStatus === 'leave') return 'on_leave'
  if (memberStatus === 'onboarding') return 'onboarding'
  if (memberStatus === 'inactive') return 'inactive'
  if (!hasUpdate) return 'no_update'
  if (hasBlockers) return 'has_blockers'
  return 'aligned'
}

function buildSection(
  weekStart: string,
  weekEnd: string,
  updates: DailyUpdate[],
  members: MineralviewTeamMember[]
): WeeklyReportSection {
  const byKey = new Map<string, DailyUpdate[]>()
  for (const u of updates) {
    const key = buildMemberKey(u.user_id) ?? `name:${u.user_name}`
    const list = byKey.get(key) ?? []
    list.push(u)
    byKey.set(key, list)
  }

  const memberByKey = new Map<string, MineralviewTeamMember>()
  for (const m of members) {
    const maybeUserId = (m as MineralviewTeamMember & { user_id?: string | number }).user_id
    const key = buildMemberKey(maybeUserId)
    if (key) memberByKey.set(key, m)
  }

  const rows: WeeklyMemberRow[] = []
  const seenKeys = new Set<string>()

  for (const [key, list] of byKey.entries()) {
    const sorted = [...list].sort((a, b) =>
      (a.submission_date ?? '').localeCompare(b.submission_date ?? '')
    )
    const member = memberByKey.get(key) ?? null
    const hasBlockers = sorted.some((u) => u.blockers_status === 'has_blockers')
    const tags = member?.tags ?? []

    rows.push({
      member_id: member?.id ?? null,
      user_id: key.startsWith('name:') ? null : key,
      name: member?.name ?? sorted[0]?.user_name ?? 'Unknown',
      email: member?.email ?? null,
      role: member?.role ?? null,
      team: teamLabelFromTags(tags),
      tags,
      member_status: member?.status ?? null,
      update_count: sorted.length,
      this_week: joinNonEmpty(
        sorted.map((u) => {
          const date = u.submission_date ?? ''
          return date ? `(${date}) ${u.work_done}` : u.work_done
        }),
        '\n\n'
      ),
      next_week: joinNonEmpty(
        sorted.map((u) => u.next_day_plan ?? ''),
        '\n\n'
      ),
      has_blockers: hasBlockers,
      blocker_notes: joinNonEmpty(
        sorted
          .filter((u) => u.blockers_status === 'has_blockers')
          .map((u) => u.blockers_description ?? ''),
        '\n'
      ),
      status: deriveStatus(true, hasBlockers, member?.status ?? null),
      last_submitted_at: sorted[sorted.length - 1]?.created_at ?? null,
      updates: sorted,
    })

    seenKeys.add(key)
  }

  for (const m of members) {
    const maybeUserId = (m as MineralviewTeamMember & { user_id?: string | number }).user_id
    const key = buildMemberKey(maybeUserId)
    if (!key || seenKeys.has(key)) continue

    rows.push({
      member_id: m.id ?? null,
      user_id: key,
      name: m.name,
      email: m.email ?? null,
      role: m.role ?? null,
      team: teamLabelFromTags(m.tags),
      tags: m.tags ?? [],
      member_status: m.status ?? null,
      update_count: 0,
      this_week: '',
      next_week: '',
      has_blockers: false,
      blocker_notes: '',
      status: deriveStatus(false, false, m.status ?? null),
      last_submitted_at: null,
      updates: [],
    })
  }

  rows.sort((a, b) => a.name.localeCompare(b.name))

  const summary: WeeklySummary = {
    updates_submitted: rows.filter((r) => r.update_count > 0).length,
    aligned: rows.filter((r) => r.status === 'aligned').length,
    constitution_signals: rows.filter((r) => r.status === 'has_blockers').length,
    no_update: rows.filter((r) => r.status === 'no_update').length,
    on_leave: rows.filter((r) => r.status === 'on_leave').length,
  }

  return { week_start: weekStart, week_end: weekEnd, summary, members: rows }
}

function buildAllSavedSection(updates: DailyUpdate[]): AllSavedSection {
  if (updates.length === 0) {
    return {
      summary: {
        total_updates: 0,
        unique_members: 0,
        earliest: null,
        latest: null,
        weeks_covered: 0,
      },
      weeks: [],
    }
  }

  const byWeek = new Map<
    string,
    { weekStart: string; weekEnd: string; updates: DailyUpdate[]; members: Set<string> }
  >()
  const memberSet = new Set<string>()
  let earliest: string | null = null
  let latest: string | null = null

  for (const u of updates) {
    const date = u.submission_date
    if (!date) continue
    if (!earliest || date < earliest) earliest = date
    if (!latest || date > latest) latest = date

    const weekStart = getMondayIso(parseIso(date))
    const weekEnd = addDaysIso(weekStart, 6)
    const bucket = byWeek.get(weekStart) ?? {
      weekStart,
      weekEnd,
      updates: [],
      members: new Set<string>(),
    }
    bucket.updates.push(u)
    bucket.members.add(buildMemberKey(u.user_id) ?? `name:${u.user_name}`)
    byWeek.set(weekStart, bucket)

    memberSet.add(buildMemberKey(u.user_id) ?? `name:${u.user_name}`)
  }

  const weeks = Array.from(byWeek.values())
    .sort((a, b) => b.weekStart.localeCompare(a.weekStart))
    .map((w) => ({
      week_start: w.weekStart,
      week_end: w.weekEnd,
      updates_submitted: w.updates.length,
      unique_members: w.members.size,
    }))

  return {
    summary: {
      total_updates: updates.length,
      unique_members: memberSet.size,
      earliest,
      latest,
      weeks_covered: weeks.length,
    },
    weeks,
  }
}

export async function getWeeklyReport(referenceDate?: Date): Promise<WeeklyReport> {
  const ref = referenceDate ?? new Date()
  const currentStart = getMondayIso(ref)
  const currentEnd = addDaysIso(currentStart, 6)
  const previousStart = addDaysIso(currentStart, -7)
  const previousEnd = addDaysIso(currentStart, -1)

  const [currentUpdates, previousUpdates, allUpdates, members] = await Promise.all([
    listDailyUpdatesByDateRange(currentStart, currentEnd),
    listDailyUpdatesByDateRange(previousStart, previousEnd),
    listAllDailyUpdates(),
    listTeamMembers(),
  ])

  const report: WeeklyReport = {
    generated_at: new Date().toISOString(),
    current_week: buildSection(currentStart, currentEnd, currentUpdates, members),
    previous_week: buildSection(previousStart, previousEnd, previousUpdates, members),
    all_saved: buildAllSavedSection(allUpdates),
  }

  log.info('weekly report built', {
    current_start: currentStart,
    previous_start: previousStart,
    current_members: report.current_week.members.length,
    all_updates: allUpdates.length,
  })

  return report
}
