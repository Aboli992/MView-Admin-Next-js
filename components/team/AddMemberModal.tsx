'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { MineralviewTeamMember } from '@/lib/types'

interface Props {
  open: boolean
  onClose: () => void
  onCreated: (member: MineralviewTeamMember) => void
  flash: (msg: string) => void
}

const ROLE_OPTIONS = [
  'Data Scientist',
  'Quality Assurance Engineer',
  'Python Developer',
  'Frontend Developer',
  'Backend Developer',
  'Content Writer',
  'Video Editor',
  'Graphic Designer',
  'Sales and Marketing Specialist',
]

const CONSTITUTION_SECTIONS = [
  '00-system',
  '01-foundations',
  '02-platform-architecture',
  '03-intelligence-systems',
  '04-product-experience',
  '05-growth-systems',
  '06-data-systems',
  '07-platform-operations',
  '08-architecture-decisions',
  '09-constitution-system',
  '90-source-materials',
  '95-analysis',
]

const ACCEPTED_EXTS = ['.pdf', '.doc', '.docx']
const ACCEPTED_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

function isAcceptedFile(file: File): boolean {
  const lower = file.name.toLowerCase()
  const hasExt = ACCEPTED_EXTS.some((ext) => lower.endsWith(ext))
  const hasMime = ACCEPTED_MIME.includes(file.type)
  return hasExt || hasMime
}

export default function AddMemberModal({ open, onClose, onCreated, flash }: Props) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [tags, setTags] = useState('')
  const [constitutionSection, setConstitutionSection] = useState('')
  const [resume, setResume] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [fieldError, setFieldError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const reset = useCallback(() => {
    setName('')
    setRole('')
    setEmail('')
    setTags('')
    setConstitutionSection('')
    setResume(null)
    setDragActive(false)
    setFieldError(null)
  }, [])

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const handleFile = useCallback(
    (file: File | null) => {
      setFieldError(null)
      if (!file) {
        setResume(null)
        return
      }
      if (!isAcceptedFile(file)) {
        setFieldError('Only .pdf, .doc, .docx files are allowed.')
        return
      }
      setResume(file)
    },
    []
  )

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      const file = e.dataTransfer.files?.[0] ?? null
      handleFile(file)
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldError(null)

    if (!name.trim()) return setFieldError('Name is required.')
    if (!email.trim()) return setFieldError('Email is required.')

    const form = new FormData()
    form.append('name', name.trim())
    form.append('email', email.trim())
    if (role.trim()) form.append('role', role.trim())
    if (tags.trim()) form.append('tags', tags.trim())
    if (constitutionSection.trim()) {
      form.append(
        'constitution_ownership',
        JSON.stringify([{ section: constitutionSection.trim() }])
      )
    }
    if (resume) form.append('resume', resume)

    setSubmitting(true)
    try {
      const res = await fetch('/api/team', { method: 'POST', body: form })
      const json = await res.json()
      if (!res.ok || !json?.success) {
        const msg = json?.error?.message ?? `Request failed (${res.status})`
        setFieldError(msg)
        setSubmitting(false)
        return
      }
      onCreated(json.data as MineralviewTeamMember)
      flash('Team member added')
      onClose()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error'
      setFieldError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Add Team Member</div>
            <div className="modal-sub">Create a new roster entry and optionally attach a resume.</div>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={onSubmit} className="modal-body">
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

          <div className="fld-row">
            <div className="fld">
              <label className="fld-l">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Select role…</option>
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="fld">
              <label className="fld-l">Email <span className="req">*</span></label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                required
              />
            </div>
          </div>

          <div className="fld">
            <label className="fld-l">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="core, growth, engineering"
            />
            <div className="fld-hint">Comma-separated list.</div>
          </div>

          <div className="fld">
            <label className="fld-l">Constitution Section</label>
            <select
              value={constitutionSection}
              onChange={(e) => setConstitutionSection(e.target.value)}
            >
              <option value="">None</option>
              {CONSTITUTION_SECTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="fld">
            <label className="fld-l">Resume</label>
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
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
              {resume ? (
                <div className="dz-file">
                  <span className="dz-file-name">{resume.name}</span>
                  <span className="dz-file-size">{(resume.size / 1024).toFixed(1)} KB</span>
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
                  <div className="dz-title">Drop resume here or click to upload</div>
                  <div className="dz-sub">PDF, DOC, DOCX · up to 10 MB</div>
                </div>
              )}
            </div>
          </div>

          {fieldError && <div className="modal-error">{fieldError}</div>}

          <div className="modal-footer">
            <button type="button" className="btn" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn btn-p" disabled={submitting}>
              {submitting ? 'Saving…' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
