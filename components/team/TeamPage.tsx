'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PageName, Role, MineralviewTeamMember } from '@/lib/types'
import AddMemberModal from './AddMemberModal'

interface Props { role: Role; go: (p: PageName) => void; flash: (m: string) => void }

interface Summary {
  total_members: number
  core: number
  growth: number
  resumes_missing: number
}

function fileNameFromPath(path: string | null | undefined): string | null {
  if (!path) return null
  const parts = path.split(/[\\/]/)
  return parts[parts.length - 1] || path
}

export default function TeamPage({ flash }: Props) {
  const [members, setMembers] = useState<MineralviewTeamMember[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const loadTeam = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/team', { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok || !json?.success) {
        throw new Error(json?.error?.message ?? `Failed to load team (${res.status})`)
      }
      setMembers(json.data as MineralviewTeamMember[])
      setSummary((json.meta?.summary as Summary) ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load team')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadTeam() }, [loadTeam])

  const computedSummary = useMemo<Summary>(() => {
    if (summary) return summary
    const normalize = (v: string) => v.trim().toLowerCase().replace(/^[@#]+/, '')
    let core = 0, growth = 0, resumes_missing = 0
    for (const m of members) {
      const labels = [...(m.tags ?? []), ...(m.teams_channels ?? [])].map(normalize)
      if (labels.includes('core')) core++
      if (labels.includes('growth')) growth++
      if ((m.resume_status ?? 'missing') !== 'uploaded') resumes_missing++
    }
    return { total_members: members.length, core, growth, resumes_missing }
  }, [members, summary])

  const handleCreated = useCallback((m: MineralviewTeamMember) => {
    setMembers((prev) => [m, ...prev])
    loadTeam()
  }, [loadTeam])

  return (
    <div>
      <div className="ph">
        <div>
          <div className="pt">Team</div>
          <div className="ps">Roster · roles · emails · Constitution file ownership · notification triggers</div>
        </div>
        <div className="ph-r admin-only flex">
          <button className="btn btn-p btn-sm" onClick={() => setModalOpen(true)}>+ Add Member</button>
        </div>
      </div>

      <div className="ss4">
        <div className="sv">
          <div className="sv-v">{loading ? '—' : computedSummary.total_members}</div>
          <div className="sv-l">Total members</div>
        </div>
        <div className="sv">
          <div className="sv-v ok">{loading ? '—' : computedSummary.core}</div>
          <div className="sv-l">@core</div>
        </div>
        <div className="sv">
          <div className="sv-v ok">{loading ? '—' : computedSummary.growth}</div>
          <div className="sv-l">@growth</div>
        </div>
        <div className="sv">
          <div className="sv-v err">{loading ? '—' : computedSummary.resumes_missing}</div>
          <div className="sv-l">Resumes missing</div>
        </div>
      </div>

      <div className="card">
        <div className="ch">
          <div>
            <div className="ct">Team roster</div>
            <div className="cs">All members · role · email · tags · Constitution ownership</div>
          </div>
          <button className="btn btn-sm" onClick={loadTeam} disabled={loading}>
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Tags</th>
              <th>Constitution Section</th>
              <th>Resume</th>
              <th className="admin-only">Actions</th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--efg)', padding: 24, fontSize: 12 }}>
                  {error}
                </td>
              </tr>
            )}
            {!error && loading && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted-fg)', padding: 24, fontSize: 12 }}>
                  Loading team…
                </td>
              </tr>
            )}
            {!error && !loading && members.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted-fg)', padding: 32, fontSize: 12 }}>
                  No team members yet. Add one via the + Add Member button.
                </td>
              </tr>
            )}
            {!loading && !error && members.map((m) => {
              const sections = (m.constitution_ownership ?? [])
                .map((o) => o.section)
                .filter(Boolean)
                .join(', ')
              const resumeName = fileNameFromPath(m.resume)
              return (
                <tr key={m.id ?? m.email}>
                  <td style={{ fontWeight: 500, color: 'var(--fg)' }}>{m.name}</td>
                  <td>{m.role ?? '—'}</td>
                  <td>{m.email}</td>
                  <td>
                    {(m.tags ?? []).length === 0 ? (
                      '—'
                    ) : (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {(m.tags ?? []).map((t) => (
                          <span key={t} className="m-tag">{t}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td>{sections || '—'}</td>
                  <td>
                    {resumeName ? (
                      <a
                        href={`/api/team/${m.id}/resume`}
                        className="resume-link"
                        onClick={(e) => {
                          e.preventDefault()
                          flash('Resume download coming soon')
                        }}
                      >
                        {resumeName}
                      </a>
                    ) : (
                      <span className="badge br"><span className="bd" />missing</span>
                    )}
                  </td>
                  <td className="admin-only">
                    <button
                      className="btn btn-sm"
                      onClick={() => flash('Edit coming soon')}
                      style={{ marginRight: 4 }}
                    >
                      Edit
                    </button>
                    <button className="btn btn-sm" onClick={() => flash('Delete coming soon')}>Delete</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <AddMemberModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
        flash={flash}
      />
    </div>
  )
}
