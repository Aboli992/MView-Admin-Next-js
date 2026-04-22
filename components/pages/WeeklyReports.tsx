'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PageName, Role } from '@/lib/types'

interface Props { role: Role; go: (p: PageName) => void; flash: (m: string) => void }

type WeeklyMemberStatus =
  | 'aligned'
  | 'has_blockers'
  | 'no_update'
  | 'on_leave'
  | 'onboarding'
  | 'inactive'

interface WeeklyMemberRow {
  member_id: string | null
  user_id: string | null
  name: string
  email: string | null
  role: string | null
  team: string
  tags: string[]
  member_status: string | null
  update_count: number
  this_week: string
  next_week: string
  has_blockers: boolean
  blocker_notes: string
  status: WeeklyMemberStatus
  last_submitted_at: string | null
}

interface WeeklySummary {
  updates_submitted: number
  aligned: number
  constitution_signals: number
  no_update: number
  on_leave: number
}

interface WeeklyReportSection {
  week_start: string
  week_end: string
  summary: WeeklySummary
  members: WeeklyMemberRow[]
}

interface AllSavedSection {
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

interface WeeklyReport {
  generated_at: string
  current_week: WeeklyReportSection
  previous_week: WeeklyReportSection
  all_saved: AllSavedSection
}

const STATUS_LABEL: Record<WeeklyMemberStatus, string> = {
  aligned: 'Aligned',
  has_blockers: 'Has blockers',
  no_update: 'No update',
  on_leave: 'On leave',
  onboarding: 'Onboarding',
  inactive: 'Inactive',
}

const STATUS_PILL_CLASS: Record<WeeklyMemberStatus, string> = {
  aligned: 'ok',
  has_blockers: 'warn',
  no_update: 'err',
  on_leave: '',
  onboarding: '',
  inactive: '',
}

function formatDateRange(start: string, end: string): string {
  if (!start || !end) return ''
  return `${start} → ${end}`
}

function truncate(text: string, max = 160): string {
  if (!text) return ''
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`
}

export default function WeeklyReports({ flash }: Props) {
  const [activeTab, setActiveTab] = useState<'current' | 'previous' | 'saved'>('current')
  const [report, setReport] = useState<WeeklyReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/operations/weekly-report', { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok || !json?.success) {
        throw new Error(json?.error?.message ?? `Failed to load (${res.status})`)
      }
      setReport(json.data as WeeklyReport)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weekly report')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const currentSummary: WeeklySummary = useMemo(
    () =>
      report?.current_week.summary ?? {
        updates_submitted: 0,
        aligned: 0,
        constitution_signals: 0,
        no_update: 0,
        on_leave: 0,
      },
    [report]
  )

  const handleExport = () => {
    if (!report) {
      flash('Nothing to export yet')
      return
    }
    const section =
      activeTab === 'previous'
        ? report.previous_week
        : activeTab === 'saved'
          ? null
          : report.current_week

    try {
      const payload = section ? { ...section } : report.all_saved
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `weekly-report-${activeTab}-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      flash('Exported')
    } catch {
      flash('Export failed')
    }
  }

  return (
    <div>
      <div className="ph">
        <div>
          <div className="pt">Weekly Reports</div>
          <div className="ps">Compiled from daily pulse submissions · auto-generated end of week</div>
        </div>
        <div className="ph-r">
          <button type="button" className="btn btn-sm" onClick={load} disabled={loading}>
            {loading ? 'Refreshing…' : '↻ Refresh'}
          </button>
          <button type="button" className="btn btn-p btn-sm" onClick={handleExport}>↓ Export</button>
        </div>
      </div>

      {error && (
        <div className="card" style={{ padding: 16, marginBottom: 12, borderColor: 'var(--err)' }}>
          <div style={{ color: 'var(--err)', fontSize: 13 }}>Failed to load weekly report: {error}</div>
        </div>
      )}

      <div className="tabs">
        <div className={`tab${activeTab === 'current' ? ' on' : ''}`} onClick={() => setActiveTab('current')}>Current week</div>
        <div className={`tab${activeTab === 'previous' ? ' on' : ''}`} onClick={() => setActiveTab('previous')}>Previous week</div>
        <div className={`tab${activeTab === 'saved' ? ' on' : ''}`} onClick={() => setActiveTab('saved')}>All saved</div>
      </div>

      {activeTab === 'current' && (
        <>
          <div className="ss5">
            <div className="sv"><div className="sv-v ok">{loading && !report ? '—' : currentSummary.updates_submitted}</div><div className="sv-l">Updates submitted</div></div>
            <div className="sv"><div className="sv-v ok">{loading && !report ? '—' : currentSummary.aligned}</div><div className="sv-l">Aligned</div></div>
            <div className="sv"><div className="sv-v warn">{loading && !report ? '—' : currentSummary.constitution_signals}</div><div className="sv-l">Constitution signals</div></div>
            <div className="sv"><div className="sv-v err">{loading && !report ? '—' : currentSummary.no_update}</div><div className="sv-l">No update</div></div>
            <div className="sv"><div className="sv-v" style={{color:'var(--muted-fg)'}}>{loading && !report ? '—' : currentSummary.on_leave}</div><div className="sv-l">On leave</div></div>
          </div>
          <MemberTable
            title="Current week — member summary"
            subtitle={report ? formatDateRange(report.current_week.week_start, report.current_week.week_end) : 'Compiled from daily submissions'}
            rows={report?.current_week.members ?? []}
            loading={loading && !report}
            emptyHint="Weekly report compiles automatically from daily pulse submissions. Data will appear here as the week progresses."
          />
        </>
      )}

      {activeTab === 'previous' && (
        <MemberTable
          title="Previous week — member summary"
          subtitle={report ? formatDateRange(report.previous_week.week_start, report.previous_week.week_end) : ''}
          rows={report?.previous_week.members ?? []}
          loading={loading && !report}
          emptyHint="Previous weekly report will appear here once archived."
          workColumnLabel="Previous week"
          showNextWeek={false}
        />
      )}

      {activeTab === 'saved' && (
        <AllSavedView section={report?.all_saved ?? null} loading={loading && !report} onExport={handleExport} />
      )}
    </div>
  )
}

function MemberTable({
  title,
  subtitle,
  rows,
  loading,
  emptyHint,
  workColumnLabel = 'This week',
  showNextWeek = true,
}: {
  title: string
  subtitle: string
  rows: WeeklyMemberRow[]
  loading: boolean
  emptyHint: string
  workColumnLabel?: string
  showNextWeek?: boolean
}) {
  const colCount = showNextWeek ? 5 : 4
  return (
    <div className="card">
      <div className="ch">
        <div className="ct">{title}</div>
        <div className="cs">{subtitle}</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Team</th>
            <th>{workColumnLabel}</th>
            {showNextWeek && <th>Next week</th>}
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={colCount} style={{ textAlign: 'center', color: 'var(--muted-fg)', padding: 32, fontSize: 12 }}>
                Loading…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={colCount} style={{ textAlign: 'center', color: 'var(--muted-fg)', padding: 32, fontSize: 12 }}>
                {emptyHint}
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={`${r.member_id ?? ''}:${r.user_id ?? r.name}`}>
                <td>
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  {r.role && <div style={{ color: 'var(--muted-fg)', fontSize: 11 }}>{r.role}</div>}
                </td>
                <td>{r.team}</td>
                <td style={{ whiteSpace: 'pre-wrap', maxWidth: 360 }}>
                  {r.this_week ? truncate(r.this_week, 240) : <span style={{ color: 'var(--muted-fg)' }}>—</span>}
                  {r.update_count > 0 && (
                    <div style={{ color: 'var(--muted-fg)', fontSize: 11, marginTop: 4 }}>
                      {r.update_count} update{r.update_count === 1 ? '' : 's'}
                    </div>
                  )}
                </td>
                {showNextWeek && (
                  <td style={{ whiteSpace: 'pre-wrap', maxWidth: 320 }}>
                    {r.next_week ? truncate(r.next_week, 240) : <span style={{ color: 'var(--muted-fg)' }}>—</span>}
                  </td>
                )}
                <td>
                  <span className={`pill ${STATUS_PILL_CLASS[r.status] ?? ''}`}>
                    {STATUS_LABEL[r.status]}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function AllSavedView({
  section,
  loading,
  onExport,
}: {
  section: AllSavedSection | null
  loading: boolean
  onExport: () => void
}) {
  return (
    <div className="card">
      <div className="ch">
        <div className="ct">All saved weekly reports</div>
        <button type="button" className="btn btn-sm" onClick={onExport}>↓ Export all</button>
      </div>

      {loading ? (
        <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted-fg)', fontSize: 12 }}>Loading…</div>
      ) : !section || section.weeks.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted-fg)', fontSize: 12 }}>
          Saved reports will appear here as weeks are archived.
        </div>
      ) : (
        <>
          <div className="ss5" style={{ marginBottom: 12 }}>
            <div className="sv"><div className="sv-v ok">{section.summary.total_updates}</div><div className="sv-l">Total updates</div></div>
            <div className="sv"><div className="sv-v ok">{section.summary.unique_members}</div><div className="sv-l">Unique members</div></div>
            <div className="sv"><div className="sv-v">{section.summary.weeks_covered}</div><div className="sv-l">Weeks covered</div></div>
            <div className="sv"><div className="sv-v" style={{ color: 'var(--muted-fg)' }}>{section.summary.earliest ?? '—'}</div><div className="sv-l">Earliest</div></div>
            <div className="sv"><div className="sv-v" style={{ color: 'var(--muted-fg)' }}>{section.summary.latest ?? '—'}</div><div className="sv-l">Latest</div></div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Week</th>
                <th>Updates submitted</th>
                <th>Unique members</th>
              </tr>
            </thead>
            <tbody>
              {section.weeks.map((w) => (
                <tr key={w.week_start}>
                  <td>{formatDateRange(w.week_start, w.week_end)}</td>
                  <td>{w.updates_submitted}</td>
                  <td>{w.unique_members}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
