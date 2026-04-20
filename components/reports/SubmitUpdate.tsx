'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { DailyUpdate } from '@/lib/types'

const ACCEPTED_EXTS = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg']
const ACCEPTED_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
]

type UiStatus = 'done' | 'in-progress' | 'blocked'

function isAcceptedFile(file: File): boolean {
  const lower = file.name.toLowerCase()
  const hasExt = ACCEPTED_EXTS.some((ext) => lower.endsWith(ext))
  const hasMime = ACCEPTED_MIME.includes(file.type)
  return hasExt || hasMime
}

function formatBytes(n: number | null | undefined): string {
  if (!n) return '—'
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(2)} MB`
}

function formatTime(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

interface Props {
  flash?: (msg: string) => void
}

export default function SubmitUpdate({ flash }: Props) {
  const notify = useCallback((msg: string) => flash?.(msg), [flash])

  const [name, setName] = useState('')
  const [userId, setUserId] = useState('1')
  const [update, setUpdate] = useState('')
  const [tags, setTags] = useState('')
  const [status, setStatus] = useState<UiStatus>('done')
  const [blockersDescription, setBlockersDescription] = useState('')
  const [nextDayPlan, setNextDayPlan] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [todays, setTodays] = useState<DailyUpdate[]>([])
  const [loadingToday, setLoadingToday] = useState(true)
  const [todayError, setTodayError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadToday = useCallback(async () => {
    setLoadingToday(true)
    setTodayError(null)
    try {
      const res = await fetch('/api/daily-updates/today', { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok || !json?.success) {
        throw new Error(json?.error?.message ?? `Failed to load (${res.status})`)
      }
      setTodays(json.data as DailyUpdate[])
    } catch (err) {
      setTodayError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoadingToday(false)
    }
  }, [])

  useEffect(() => { loadToday() }, [loadToday])

  const handleFile = useCallback((f: File | null) => {
    setFormError(null)
    if (!f) return setFile(null)
    if (!isAcceptedFile(f)) {
      setFormError('Only .pdf, .doc, .docx, .png, .jpg files are allowed.')
      return
    }
    setFile(f)
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      handleFile(e.dataTransfer.files?.[0] ?? null)
    },
    [handleFile]
  )
  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])
  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const resetForm = () => {
    setName('')
    setUserId('1')
    setUpdate('')
    setTags('')
    setStatus('done')
    setBlockersDescription('')
    setNextDayPlan('')
    setFile(null)
    setFormError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!name.trim()) return setFormError('Name is required.')
    if (!update.trim()) return setFormError('Update is required.')
    const parsedUserId = Number.parseInt(userId, 10)
    if (!Number.isFinite(parsedUserId) || parsedUserId <= 0) {
      return setFormError('User ID must be a positive integer.')
    }
    if (status === 'blocked' && !blockersDescription.trim()) {
      return setFormError('Please describe the blocker.')
    }

    const blockersStatus = status === 'blocked' ? 'has_blockers' : 'no_blockers'

    const form = new FormData()
    form.append('user_id', String(parsedUserId))
    form.append('user_name', name.trim())
    form.append('work_done', update.trim())
    form.append('blockers_status', blockersStatus)
    if (status === 'blocked') form.append('blockers_description', blockersDescription.trim())
    if (nextDayPlan.trim()) form.append('next_day_plan', nextDayPlan.trim())
    if (tags.trim()) form.append('tags', tags.trim())
    form.append('ui_status', status)
    if (file) form.append('attachment', file)

    setSubmitting(true)
    try {
      const res = await fetch('/api/daily-updates', { method: 'POST', body: form })
      const json = await res.json()
      if (!res.ok || !json?.success) {
        const msg = json?.error?.message ?? `Request failed (${res.status})`
        setFormError(msg)
        setSubmitting(false)
        return
      }
      notify('Update submitted')
      resetForm()
      await loadToday()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="ph">
        <div>
          <div className="pt">Submit Daily Update</div>
          <div className="ps">Post your update · feeds Daily Pulse and the Weekly Report</div>
        </div>
      </div>

      <div className="two">
        <div className="card">
          <div className="ch">
            <div className="ct">Daily update form</div>
            <div className="cs">All fields with * are required</div>
          </div>
          <form onSubmit={onSubmit} className="modal-body" style={{ padding: '14px 16px' }}>
            <div className="fld-row">
              <div className="fld">
                <label className="fld-l">Name <span className="req">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                />
              </div>
              <div className="fld">
                <label className="fld-l">User ID <span className="req">*</span></label>
                <input
                  type="number"
                  min={1}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="fld">
              <label className="fld-l">Update <span className="req">*</span></label>
              <textarea
                value={update}
                onChange={(e) => setUpdate(e.target.value)}
                placeholder="Describe what you worked on today…"
                rows={5}
                required
              />
            </div>

            <div className="fld-row">
              <div className="fld">
                <label className="fld-l">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as UiStatus)}>
                  <option value="done">Done</option>
                  <option value="in-progress">In progress</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              <div className="fld">
                <label className="fld-l">Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="core, growth, pipeline"
                />
              </div>
            </div>

            {status === 'blocked' && (
              <div className="fld">
                <label className="fld-l">Blocker description <span className="req">*</span></label>
                <textarea
                  value={blockersDescription}
                  onChange={(e) => setBlockersDescription(e.target.value)}
                  placeholder="What is blocking you?"
                  rows={3}
                />
              </div>
            )}

            <div className="fld">
              <label className="fld-l">Next day plan</label>
              <textarea
                value={nextDayPlan}
                onChange={(e) => setNextDayPlan(e.target.value)}
                placeholder="What are you planning tomorrow?"
                rows={2}
              />
            </div>

            <div className="fld">
              <label className="fld-l">Attachment</label>
              <div
                className={`dropzone ${dragActive ? 'active' : ''}`}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragEnter={onDragOver}
                onDragLeave={onDragLeave}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
                {file ? (
                  <div className="dz-file">
                    <span className="dz-file-name">{file.name}</span>
                    <span className="dz-file-size">{formatBytes(file.size)}</span>
                    <button
                      type="button"
                      className="dz-remove"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFile(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="dz-empty">
                    <div className="dz-title">Drop file here or click to upload</div>
                    <div className="dz-sub">PDF, DOC, DOCX, PNG, JPG · up to 10 MB</div>
                  </div>
                )}
              </div>
            </div>

            {formError && <div className="modal-error">{formError}</div>}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" className="btn" onClick={resetForm} disabled={submitting}>Reset</button>
              <button type="submit" className="btn btn-p" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Update'}
              </button>
            </div>
          </form>
        </div>

        <div className="card">
          <div className="ch">
            <div>
              <div className="ct">Today&apos;s submissions</div>
              <div className="cs">{loadingToday ? 'Loading…' : `${todays.length} submitted today`}</div>
            </div>
            <button className="btn btn-sm" onClick={loadToday} disabled={loadingToday}>
              {loadingToday ? 'Loading…' : 'Refresh'}
            </button>
          </div>
          <div style={{ padding: todays.length ? 0 : 24 }}>
            {todayError && (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--efg)', fontSize: 12 }}>
                {todayError}
              </div>
            )}
            {!todayError && !loadingToday && todays.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--muted-fg)', fontSize: 12 }}>
                No submissions yet today.
              </div>
            )}
            {!todayError && todays.map((u) => (
              <div key={u.id ?? `${u.user_id}-${u.created_at}`} className="du-row">
                <div className="du-head">
                  <div className="du-name">{u.user_name}</div>
                  <div className="du-meta">
                    <span className={`badge ${u.blockers_status === 'has_blockers' ? 'ba' : 'bg'}`}>
                      <span className="bd" />
                      {u.blockers_status === 'has_blockers' ? 'blocked' : 'clear'}
                    </span>
                    <span className="du-time">{formatTime(u.created_at)}</span>
                  </div>
                </div>
                <div className="du-body">{u.work_done}</div>
                {u.blockers_status === 'has_blockers' && u.blockers_description && (
                  <div className="du-blockers">Blocker: {u.blockers_description}</div>
                )}
                {u.next_day_plan && (
                  <div className="du-plan"><span className="du-label">Next:</span> {u.next_day_plan}</div>
                )}
                {u.attachment_path && (
                  <div className="du-file">
                    <a
                      href={u.attachment_path}
                      target="_blank"
                      rel="noreferrer"
                      className="resume-link"
                    >
                      {u.attachment_original_name ?? 'attachment'}
                    </a>
                    <span className="dz-file-size">{formatBytes(u.attachment_size)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
