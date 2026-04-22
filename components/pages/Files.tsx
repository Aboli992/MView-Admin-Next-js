'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PageName, Role } from '@/lib/types'

interface Props { role: Role; go: (p: PageName) => void; flash: (m: string) => void }

interface ResumeFileRow {
  member_id: string | null
  name: string
  role: string | null
  email: string | null
  team: string
  tags: string[]
  resume_status: 'missing' | 'uploaded' | 'pending' | undefined
  path: string | null
  url: string | null
  filename: string | null
  uploaded_at: string | null
}

interface DailyUpdateAttachmentRow {
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

interface MemberAttachmentGroup {
  key: string
  name: string
  role: string | null
  team: string
  count: number
  attachments: DailyUpdateAttachmentRow[]
}

function formatBytes(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined || Number.isNaN(bytes)) return '—'
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  const value = bytes / Math.pow(1024, i)
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`
}

function formatDateTime(value: string | null): string {
  if (!value) return '—'
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return d.toLocaleString()
  } catch {
    return value
  }
}

export default function Files({ flash }: Props) {
  const [activeTab, setActiveTab] = useState<'resumes' | 'updates' | 'docs'>('resumes')

  const [resumes, setResumes] = useState<ResumeFileRow[] | null>(null)
  const [resumesLoading, setResumesLoading] = useState(false)
  const [resumesError, setResumesError] = useState<string | null>(null)

  const [attachments, setAttachments] = useState<DailyUpdateAttachmentRow[] | null>(null)
  const [attachmentsLoading, setAttachmentsLoading] = useState(false)
  const [attachmentsError, setAttachmentsError] = useState<string | null>(null)

  const loadResumes = useCallback(async () => {
    setResumesLoading(true)
    setResumesError(null)
    try {
      const res = await fetch('/api/operations/files/resumes', { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok || !json?.success) {
        throw new Error(json?.error?.message ?? `Failed to load (${res.status})`)
      }
      setResumes(json.data as ResumeFileRow[])
    } catch (err) {
      setResumesError(err instanceof Error ? err.message : 'Failed to load resumes')
    } finally {
      setResumesLoading(false)
    }
  }, [])

  const loadAttachments = useCallback(async () => {
    setAttachmentsLoading(true)
    setAttachmentsError(null)
    try {
      const res = await fetch('/api/operations/files/daily-updates', { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok || !json?.success) {
        throw new Error(json?.error?.message ?? `Failed to load (${res.status})`)
      }
      setAttachments(json.data as DailyUpdateAttachmentRow[])
    } catch (err) {
      setAttachmentsError(err instanceof Error ? err.message : 'Failed to load daily updates')
    } finally {
      setAttachmentsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'resumes' && resumes === null && !resumesLoading) {
      loadResumes()
    }
    if (activeTab === 'updates' && attachments === null && !attachmentsLoading) {
      loadAttachments()
    }
  }, [activeTab, resumes, resumesLoading, loadResumes, attachments, attachmentsLoading, loadAttachments])

  const attachmentGroups: MemberAttachmentGroup[] = useMemo(() => {
    if (!attachments) return []
    const byKey = new Map<string, MemberAttachmentGroup>()
    for (const a of attachments) {
      const key = a.member_id ?? a.user_id ?? `name:${a.name}`
      const group = byKey.get(key) ?? {
        key,
        name: a.name,
        role: a.role,
        team: a.team,
        count: 0,
        attachments: [],
      }
      group.attachments.push(a)
      group.count += 1
      byKey.set(key, group)
    }
    return Array.from(byKey.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [attachments])

  const handleRefresh = () => {
    if (activeTab === 'resumes') loadResumes()
    else if (activeTab === 'updates') loadAttachments()
    else flash('Nothing to refresh')
  }

  return (
    <div>
      <div className="ph">
        <div>
          <div className="pt">Files</div>
          <div className="ps">Resumes · daily updates · documents · replaces Google Drive for team files</div>
        </div>
        <div className="ph-r">
          <button type="button" className="btn btn-sm" onClick={handleRefresh} disabled={resumesLoading || attachmentsLoading}>
            {(resumesLoading && activeTab === 'resumes') || (attachmentsLoading && activeTab === 'updates') ? 'Refreshing…' : '↻ Refresh'}
          </button>
          <button type="button" className="btn btn-p btn-sm" onClick={() => flash('Upload coming soon')}>↑ Upload</button>
        </div>
      </div>

      <div className="tabs">
        <div className={`tab${activeTab === 'resumes' ? ' on' : ''}`} onClick={() => setActiveTab('resumes')}>Resumes</div>
        <div className={`tab${activeTab === 'updates' ? ' on' : ''}`} onClick={() => setActiveTab('updates')}>Daily Updates</div>
        <div className={`tab${activeTab === 'docs' ? ' on' : ''}`} onClick={() => setActiveTab('docs')}>Documents</div>
      </div>

      {activeTab === 'resumes' && (
        <ResumesTab
          rows={resumes ?? []}
          loading={resumesLoading && resumes === null}
          error={resumesError}
        />
      )}

      {activeTab === 'updates' && (
        <DailyUpdatesTab
          groups={attachmentGroups}
          total={attachments?.length ?? 0}
          loading={attachmentsLoading && attachments === null}
          error={attachmentsError}
        />
      )}

      {activeTab === 'docs' && (
        <div className="card">
          <div className="ch">
            <div className="ct">Team documents</div>
            <button type="button" className="btn btn-sm" onClick={() => flash('Upload coming soon')}>↑ Upload</button>
          </div>
          <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>Upload team documents here — alignment docs, build plans, roadmaps.</div>
        </div>
      )}
    </div>
  )
}

function StatusPill({ status, hasUrl }: { status: ResumeFileRow['resume_status']; hasUrl: boolean }) {
  if (hasUrl) return <span className="pill ok">Uploaded</span>
  if (status === 'pending') return <span className="pill warn">Pending</span>
  return <span className="pill err">Missing</span>
}

function ResumesTab({
  rows,
  loading,
  error,
}: {
  rows: ResumeFileRow[]
  loading: boolean
  error: string | null
}) {
  const uploaded = rows.filter((r) => r.url).length
  const missing = rows.length - uploaded

  return (
    <div className="card">
      <div className="ch">
        <div className="ct">Team resumes</div>
        <div className="cs">
          {loading
            ? 'Loading…'
            : rows.length === 0
              ? 'No team members yet'
              : `${uploaded} uploaded · ${missing} missing`}
        </div>
      </div>

      {error && (
        <div style={{ padding: 16, color: 'var(--err)', fontSize: 13 }}>
          Failed to load resumes: {error}
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Member</th>
            <th>Team</th>
            <th>Status</th>
            <th>File</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted-fg)', padding: 32, fontSize: 12 }}>
                Loading…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted-fg)', padding: 32, fontSize: 12 }}>
                Resumes uploaded by team members will appear here. Missing resumes can be requested directly.
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.member_id ?? r.email ?? r.name}>
                <td>
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  {r.role && <div style={{ color: 'var(--muted-fg)', fontSize: 11 }}>{r.role}</div>}
                </td>
                <td>{r.team}</td>
                <td><StatusPill status={r.resume_status} hasUrl={Boolean(r.url)} /></td>
                <td>
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noreferrer" className="resume-link">
                      {r.filename ?? 'View'}
                    </a>
                  ) : (
                    <span style={{ color: 'var(--muted-fg)' }}>—</span>
                  )}
                </td>
                <td style={{ color: 'var(--muted-fg)', fontSize: 12 }}>
                  {formatDateTime(r.uploaded_at)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function DailyUpdatesTab({
  groups,
  total,
  loading,
  error,
}: {
  groups: MemberAttachmentGroup[]
  total: number
  loading: boolean
  error: string | null
}) {
  return (
    <div className="card">
      <div className="ch">
        <div className="ct">Daily update archive</div>
        <div className="cs">
          {loading
            ? 'Loading…'
            : total === 0
              ? 'No attachments yet'
              : `${total} file${total === 1 ? '' : 's'} · ${groups.length} member${groups.length === 1 ? '' : 's'}`}
        </div>
      </div>

      {error && (
        <div style={{ padding: 16, color: 'var(--err)', fontSize: 13 }}>
          Failed to load daily updates: {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted-fg)', fontSize: 12 }}>
          Loading…
        </div>
      ) : groups.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted-fg)', fontSize: 12 }}>
          Daily pulse submissions are automatically archived here.
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Team</th>
              <th>Date</th>
              <th>File</th>
              <th>Size</th>
              <th>Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {groups.flatMap((g) =>
              g.attachments.map((a, idx) => (
                <tr key={`${g.key}-${a.update_id ?? idx}`}>
                  {idx === 0 ? (
                    <td rowSpan={g.attachments.length}>
                      <div style={{ fontWeight: 600 }}>{g.name}</div>
                      {g.role && <div style={{ color: 'var(--muted-fg)', fontSize: 11 }}>{g.role}</div>}
                      <div style={{ color: 'var(--muted-fg)', fontSize: 11, marginTop: 2 }}>
                        {g.count} file{g.count === 1 ? '' : 's'}
                      </div>
                    </td>
                  ) : null}
                  {idx === 0 ? (
                    <td rowSpan={g.attachments.length}>{g.team}</td>
                  ) : null}
                  <td>{a.submission_date}</td>
                  <td>
                    <a href={a.url} target="_blank" rel="noreferrer" className="resume-link">
                      {a.filename ?? 'attachment'}
                    </a>
                  </td>
                  <td style={{ color: 'var(--muted-fg)', fontSize: 12 }}>{formatBytes(a.size)}</td>
                  <td style={{ color: 'var(--muted-fg)', fontSize: 12 }}>{formatDateTime(a.uploaded_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}
