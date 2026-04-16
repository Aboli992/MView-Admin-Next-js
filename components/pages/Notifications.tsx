'use client'

import { useState } from 'react'
import type { NotifHistoryItem } from '@/lib/types'
import { DOC_OWNERS } from '@/lib/docOwners'
import { DOC_MESSAGES, getDefaultMessage } from '@/lib/docMessages'
import { MANUAL_MEMBERS, MANUAL_MEMBER_LABELS } from '@/lib/constants'

interface Props { flash: (m: string) => void }

const ALL_DOCS: { group: string; options: { value: string; label: string }[] }[] = [
  { group: '00 — System', options: [
    { value: 'docs/00-system/00-system-overview.md', label: 'docs/00-system/00-system-overview.md' },
    { value: 'docs/00-system/01-three-brain-architecture.md', label: 'docs/00-system/01-three-brain-architecture.md' },
    { value: 'docs/00-system/04-current-platform-inventory.md', label: 'docs/00-system/04-current-platform-inventory.md' },
  ]},
  { group: '01 — Foundations', options: [
    { value: 'docs/01-foundations/00-company-thesis.md', label: 'docs/01-foundations/00-company-thesis.md' },
    { value: 'docs/01-foundations/01-persona-ecosystem.md', label: 'docs/01-foundations/01-persona-ecosystem.md' },
    { value: 'docs/01-foundations/03-product-blueprint.md', label: 'docs/01-foundations/03-product-blueprint.md' },
    { value: 'docs/01-foundations/04-intelligence-model.md', label: 'docs/01-foundations/04-intelligence-model.md' },
    { value: 'docs/01-foundations/05-behavior-system.md', label: 'docs/01-foundations/05-behavior-system.md' },
    { value: 'docs/01-foundations/06-trust-determinism-model.md', label: 'docs/01-foundations/06-trust-determinism-model.md' },
    { value: 'docs/01-foundations/07-growth-intelligence-model.md', label: 'docs/01-foundations/07-growth-intelligence-model.md' },
  ]},
  { group: '02 — Platform Architecture', options: [
    { value: 'docs/02-platform-architecture/00-platform-architecture-overview.md', label: 'docs/02-platform-architecture/00-platform-architecture-overview.md' },
    { value: 'docs/02-platform-architecture/04-deterministic-brain-architecture.md', label: 'docs/02-platform-architecture/04-deterministic-brain-architecture.md' },
    { value: 'docs/02-platform-architecture/05-user-brain-architecture.md', label: 'docs/02-platform-architecture/05-user-brain-architecture.md' },
    { value: 'docs/02-platform-architecture/10-frontend-architecture.md', label: 'docs/02-platform-architecture/10-frontend-architecture.md' },
    { value: 'docs/02-platform-architecture/11-backend-architecture.md', label: 'docs/02-platform-architecture/11-backend-architecture.md' },
    { value: 'docs/02-platform-architecture/12-database-architecture.md', label: 'docs/02-platform-architecture/12-database-architecture.md' },
  ]},
  { group: '03 — Intelligence Systems', options: [
    { value: 'docs/03-intelligence-systems/00-intelligence-systems-overview.md', label: 'docs/03-intelligence-systems/00-intelligence-systems-overview.md' },
    { value: 'docs/03-intelligence-systems/04-intelligence-models.md', label: 'docs/03-intelligence-systems/04-intelligence-models.md' },
    { value: 'docs/03-intelligence-systems/10-deterministic-engine.md', label: 'docs/03-intelligence-systems/10-deterministic-engine.md' },
    { value: 'docs/03-intelligence-systems/12-user-intelligence.md', label: 'docs/03-intelligence-systems/12-user-intelligence.md' },
  ]},
  { group: '05 — Growth Systems', options: [
    { value: 'docs/05-growth-systems/00-growth-systems-overview.md', label: 'docs/05-growth-systems/00-growth-systems-overview.md' },
    { value: 'docs/05-growth-systems/01-content-engine.md', label: 'docs/05-growth-systems/01-content-engine.md' },
    { value: 'docs/05-growth-systems/03-seo-architecture.md', label: 'docs/05-growth-systems/03-seo-architecture.md' },
    { value: 'docs/05-growth-systems/04-llm-discovery.md', label: 'docs/05-growth-systems/04-llm-discovery.md' },
    { value: 'docs/05-growth-systems/05-crm-integration.md', label: 'docs/05-growth-systems/05-crm-integration.md' },
  ]},
  { group: '06 — Data Systems', options: [
    { value: 'docs/06-data-systems/00-dataset-ingestion-map.md', label: 'docs/06-data-systems/00-dataset-ingestion-map.md' },
    { value: 'docs/06-data-systems/02-data-pipeline-architecture.md', label: 'docs/06-data-systems/02-data-pipeline-architecture.md' },
    { value: 'docs/06-data-systems/03-deterministic-validation.md', label: 'docs/06-data-systems/03-deterministic-validation.md' },
    { value: 'docs/06-data-systems/04-audit-and-logging.md', label: 'docs/06-data-systems/04-audit-and-logging.md' },
  ]},
  { group: '07 — Platform Operations', options: [
    { value: 'docs/07-platform-operations/01-team-roles.md', label: 'docs/07-platform-operations/01-team-roles.md' },
    { value: 'docs/07-platform-operations/02-system-ownership.md', label: 'docs/07-platform-operations/02-system-ownership.md' },
    { value: 'docs/07-platform-operations/07-development-workflow.md', label: 'docs/07-platform-operations/07-development-workflow.md' },
  ]},
  { group: '08 — Architecture Decisions', options: [
    { value: 'docs/08-architecture-decisions/ADR-001-deterministic-intelligence.md', label: 'ADR-001-deterministic-intelligence.md' },
    { value: 'docs/08-architecture-decisions/ADR-002-navigation-model.md', label: 'ADR-002-navigation-model.md' },
    { value: 'docs/08-architecture-decisions/ADR-003-behavior-phase-engine.md', label: 'ADR-003-behavior-phase-engine.md' },
    { value: 'docs/08-architecture-decisions/ADR-004-separate-growth-surface.md', label: 'ADR-004-separate-growth-surface.md' },
    { value: 'docs/08-architecture-decisions/ADR-005-deterministic-first-ai.md', label: 'ADR-005-deterministic-first-ai.md' },
  ]},
  { group: '09 — Constitution System', options: [
    { value: 'docs/09-constitution-system/02-governance.md', label: 'docs/09-constitution-system/02-governance.md' },
    { value: 'docs/09-constitution-system/04-update-process.md', label: 'docs/09-constitution-system/04-update-process.md' },
    { value: 'docs/09-constitution-system/12-drift-detection.md', label: 'docs/09-constitution-system/12-drift-detection.md' },
  ]},
]

export default function Notifications({ flash }: Props) {
  const [selectedDoc, setSelectedDoc] = useState('')
  const [autoRecipients, setAutoRecipients] = useState<string[]>([])
  const [manualRecipients, setManualRecipients] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [showAutofill, setShowAutofill] = useState(false)
  const [manualSelect, setManualSelect] = useState('')
  const [history, setHistory] = useState<NotifHistoryItem[]>([])

  function onDocChange(doc: string) {
    setSelectedDoc(doc)
    setManualRecipients([])
    if (!doc) {
      setAutoRecipients([])
      setMessage('')
      setShowAutofill(false)
      return
    }
    const owners = (DOC_OWNERS[doc] ?? []).slice()
    setAutoRecipients(owners)
    const msg = DOC_MESSAGES[doc] ?? getDefaultMessage(doc)
    setMessage(msg)
    setShowAutofill(true)
  }

  function removeRecipient(name: string, type: 'auto' | 'manual') {
    if (type === 'auto') setAutoRecipients(prev => prev.filter(n => n !== name))
    else setManualRecipients(prev => prev.filter(n => n !== name))
  }

  function addManual() {
    if (!manualSelect) return
    if (autoRecipients.includes(manualSelect) || manualRecipients.includes(manualSelect)) {
      flash('Already added')
      return
    }
    setManualRecipients(prev => [...prev, manualSelect])
    setManualSelect('')
  }

  function sendNotification() {
    if (!selectedDoc) { flash('Select a document first'); return }
    const all = [...autoRecipients, ...manualRecipients]
    if (all.length === 0) { flash('Add at least one recipient'); return }
    if (!message.trim()) { flash('Add a message before sending'); return }

    const shortDoc = selectedDoc.split('/').pop() ?? selectedDoc
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    setHistory(prev => [{
      doc: shortDoc, fullDoc: selectedDoc,
      recipients: all.join(', '), date: dateStr, msg: message,
    }, ...prev])

    // Reset form
    setSelectedDoc('')
    setAutoRecipients([])
    setManualRecipients([])
    setMessage('')
    setShowAutofill(false)

    flash(`Notification sent to ${all.length} member${all.length !== 1 ? 's' : ''}`)
  }

  const allRecipients = [...autoRecipients, ...manualRecipients]
  const hasRecipients = allRecipients.length > 0

  return (
    <div>
      <div className="ph">
        <div>
          <div className="pt">Constitution Notifications</div>
          <div className="ps">Super Admin · auto-tags document owners · auto-drafts impact message grounded in Constitution</div>
        </div>
        <div className="ph-r">
          <button className="btn btn-su btn-sm" onClick={sendNotification}>Send Notification</button>
        </div>
      </div>

      <div className="two">
        {/* LEFT: BUILDER */}
        <div>
          <div className="card">
            <div className="ch"><div className="ct">Send constitution update alert</div><div className="cs">Select a doc → owners auto-tag → message auto-drafts</div></div>
            <div style={{padding:16,display:'flex',flexDirection:'column',gap:14}}>

              {/* Step 1 */}
              <div className="nb-section">
                <div className="nb-label">1. Document updated</div>
                <select className="nb-select" value={selectedDoc} onChange={e => onDocChange(e.target.value)}>
                  <option value="">Select a Constitution document…</option>
                  {ALL_DOCS.map(g => (
                    <optgroup key={g.group} label={g.group}>
                      {g.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Step 2 */}
              <div className="nb-section">
                <div className="nb-label">
                  2. Notify members
                  <span style={{fontWeight:400,textTransform:'none',letterSpacing:0,marginLeft:6,fontSize:10,color:'var(--pfg)'}}>
                    auto-tagged from ownership map
                  </span>
                </div>
                <div className="recip-area">
                  {!hasRecipients && (
                    <span style={{fontSize:11,color:'var(--muted-fg)',padding:'4px 2px'}}>Select a document above to auto-tag owners</span>
                  )}
                  {autoRecipients.map(name => (
                    <span key={name} className="recip-tag recip-auto">
                      {name}
                      <span className="recip-remove" onClick={() => removeRecipient(name, 'auto')}>×</span>
                    </span>
                  ))}
                  {manualRecipients.map(name => (
                    <span key={name} className="recip-tag recip-manual">
                      {name}
                      <span className="recip-remove" onClick={() => removeRecipient(name, 'manual')}>×</span>
                    </span>
                  ))}
                </div>
                <div className="recip-legend">
                  <span><span className="recip-legend-dot dot-auto"/>Auto-tagged (document owner)</span>
                  <span><span className="recip-legend-dot dot-manual"/>Manually added</span>
                </div>
                <div style={{marginTop:6,display:'flex',gap:6,alignItems:'center'}}>
                  <select
                    id="manual-add-select"
                    className="nb-select"
                    style={{flex:1,fontSize:11}}
                    value={manualSelect}
                    onChange={e => setManualSelect(e.target.value)}
                  >
                    <option value="">+ Add another member manually…</option>
                    {MANUAL_MEMBERS.map(m => (
                      <option key={m} value={m}>{MANUAL_MEMBER_LABELS[m]}</option>
                    ))}
                  </select>
                  <button className="btn btn-sm" onClick={addManual}>Add</button>
                </div>
              </div>

              {/* Step 3 */}
              <div className="nb-section">
                {showAutofill && (
                  <div className="autofill-bar">
                    <span className="autofill-dot"/>
                    Message auto-drafted from Constitution ownership map and current team workflow. Edit before sending.
                  </div>
                )}
                <div className="nb-label">3. Message to recipients</div>
                <textarea
                  className="nb-textarea"
                  rows={10}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Select a document above — the message will auto-draft based on who owns this doc and how it affects their current work."
                />
              </div>

              <button className="btn btn-p" style={{width:'100%'}} onClick={sendNotification}>Send via Email</button>
            </div>
          </div>
        </div>

        {/* RIGHT: INFO + HISTORY */}
        <div>
          <div className="card">
            <div className="ch"><div className="ct">What this does</div></div>
            <div style={{padding:'12px 14px',fontSize:12,lineHeight:1.7,color:'var(--muted-fg)'}}>
              <p style={{marginBottom:8}}><strong style={{color:'var(--fg)'}}>1. Select the document that changed.</strong> The system looks up the Constitution ownership map and automatically tags every member who owns or co-owns that file.</p>
              <p style={{marginBottom:8}}><strong style={{color:'var(--fg)'}}>2. Recipients auto-populate.</strong> Green tags = automatically assigned from ownership. Blue tags = manually added. Click × on any tag to remove. Add anyone extra from the dropdown.</p>
              <p style={{marginBottom:8}}><strong style={{color:'var(--fg)'}}>3. Message auto-drafts.</strong> The draft explains what the document covers, what changed, and how it connects to each recipient&apos;s current work and active responsibilities.</p>
              <p><strong style={{color:'var(--fg)'}}>Edit before sending.</strong> The draft is a starting point. Add specifics about what exactly changed in this update before hitting Send.</p>
            </div>
          </div>

          <div className="card">
            <div className="ch"><div className="ct">Notification history</div></div>
            {history.length === 0 ? (
              <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>Sent notifications will appear here.</div>
            ) : (
              history.map((h, i) => (
                <div key={i} className="nh-row">
                  <div>
                    <div className="nh-doc">{h.doc}</div>
                    <div className="nh-detail">Sent to {h.recipients} · {h.date}</div>
                  </div>
                  <div className="nh-r"><span className="badge bg">Sent</span></div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
