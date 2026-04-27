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

interface EditDraft {
  name: string
  role: string
  email: string
  tags: string
  constitution_section: string
}

function fileNameFromPath(path: string | null | undefined): string | null {
  if (!path) return null
  const parts = path.split(/[\\/]/)
  return parts[parts.length - 1] || path
}

function buildDraft(m: MineralviewTeamMember): EditDraft {
  const sections = (m.constitution_ownership ?? [])
    .map((o) => o.section)
    .filter(Boolean)
    .join(', ')
  return {
    name: m.name ?? '',
    role: m.role ?? '',
    email: m.email ?? '',
    tags: (m.tags ?? []).join(', '),
    constitution_section: sections,
  }
}

export default function TeamPage({ flash }: Props) {
  const [members, setMembers] = useState<MineralviewTeamMember[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<EditDraft | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [rowError, setRowError] = useState<{ id: string; message: string } | null>(null)

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

  const startEdit = useCallback((m: MineralviewTeamMember) => {
    if (!m.id) return
    setRowError(null)
    setEditingId(m.id)
    setDraft(buildDraft(m))
  }, [])

  const cancelEdit = useCallback(() => {
    setEditingId(null)
    setDraft(null)
    setRowError(null)
  }, [])

  const saveEdit = useCallback(async (id: string) => {
    if (!draft) return
    if (!draft.name.trim()) {
      setRowError({ id, message: 'Name is required.' })
      return
    }
    if (!draft.email.trim()) {
      setRowError({ id, message: 'Email is required.' })
      return
    }

    const body: Record<string, unknown> = {
      name: draft.name.trim(),
      email: draft.email.trim(),
      role: draft.role.trim() || null,
      tags: draft.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      constitution_ownership: draft.constitution_section
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((section) => ({ section })),
    }

    setSavingId(id)
    setRowError(null)
    try {
      const res = await fetch(`/api/team/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok || !json?.success) {
        const msg = json?.error?.message ?? `Update failed (${res.status})`
        setRowError({ id, message: msg })
        flash(msg)
        return
      }
      const updated = json.data as MineralviewTeamMember
      setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)))
      setEditingId(null)
      setDraft(null)
      flash('Team member updated')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error'
      setRowError({ id, message: msg })
      flash(msg)
    } finally {
      setSavingId(null)
    }
  }, [draft, flash])

  const deleteMember = useCallback(async (m: MineralviewTeamMember) => {
    if (!m.id) return
    const confirmed = window.confirm(`Are you sure you want to delete ${m.name}?`)
    if (!confirmed) return

    setDeletingId(m.id)
    setRowError(null)
    try {
      const res = await fetch(`/api/team/${m.id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok || !json?.success) {
        const msg = json?.error?.message ?? `Delete failed (${res.status})`
        setRowError({ id: m.id, message: msg })
        flash(msg)
        return
      }
      setMembers((prev) => prev.filter((x) => x.id !== m.id))
      if (editingId === m.id) cancelEdit()
      flash('Team member deleted')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error'
      setRowError({ id: m.id, message: msg })
      flash(msg)
    } finally {
      setDeletingId(null)
    }
  }, [flash, editingId, cancelEdit])

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
              const isEditing = !!m.id && editingId === m.id
              const isSaving = !!m.id && savingId === m.id
              const isDeleting = !!m.id && deletingId === m.id
              const showRowError = !!m.id && rowError?.id === m.id

              if (isEditing && draft) {
                return (
                  <tr key={m.id ?? m.email}>
                    <td>
                      <input
                        type="text"
                        value={draft.name}
                        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                        disabled={isSaving}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={draft.role}
                        onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                        disabled={isSaving}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        value={draft.email}
                        onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                        disabled={isSaving}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={draft.tags}
                        onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
                        disabled={isSaving}
                        placeholder="comma, separated"
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={draft.constitution_section}
                        onChange={(e) => setDraft({ ...draft, constitution_section: e.target.value })}
                        disabled={isSaving}
                        placeholder="comma, separated"
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td>
                      {resumeName ?? <span className="badge br"><span className="bd" />missing</span>}
                    </td>
                    <td className="admin-only">
                      <button
                        className="btn btn-p btn-sm"
                        onClick={() => m.id && saveEdit(m.id)}
                        disabled={isSaving}
                        style={{ marginRight: 4 }}
                      >
                        {isSaving ? 'Saving…' : 'Save'}
                      </button>
                      <button
                        className="btn btn-sm"
                        onClick={cancelEdit}
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                      {showRowError && (
                        <div style={{ color: 'var(--efg)', fontSize: 11, marginTop: 4 }}>
                          {rowError?.message}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              }

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
                      onClick={() => startEdit(m)}
                      disabled={isDeleting || !m.id}
                      style={{ marginRight: 4 }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm"
                      onClick={() => deleteMember(m)}
                      disabled={isDeleting || !m.id}
                    >
                      {isDeleting ? 'Deleting…' : 'Delete'}
                    </button>
                    {showRowError && (
                      <div style={{ color: 'var(--efg)', fontSize: 11, marginTop: 4 }}>
                        {rowError?.message}
                      </div>
                    )}
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
