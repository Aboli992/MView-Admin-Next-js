'use client'

import { useState } from 'react'
import type { PageName, Role } from '@/lib/types'

interface Props { role: Role; go: (p: PageName) => void; flash: (m: string) => void }

const DOC_OPTIONS: { value: string; type: 'minor'|'moderate'|'major'; label: string }[] = [
  { value: 'docs/00-system/00-system-overview.md', type: 'minor', label: 'docs/00-system/00-system-overview.md' },
  { value: 'docs/00-system/01-three-brain-architecture.md', type: 'minor', label: 'docs/00-system/01-three-brain-architecture.md' },
  { value: 'docs/01-foundations/00-company-thesis.md', type: 'major', label: 'docs/01-foundations/00-company-thesis.md' },
  { value: 'docs/01-foundations/03-product-blueprint.md', type: 'major', label: 'docs/01-foundations/03-product-blueprint.md' },
  { value: 'docs/01-foundations/06-trust-determinism-model.md', type: 'major', label: 'docs/01-foundations/06-trust-determinism-model.md' },
  { value: 'docs/02-platform-architecture/10-frontend-architecture.md', type: 'moderate', label: 'docs/02-platform-architecture/10-frontend-architecture.md' },
  { value: 'docs/02-platform-architecture/11-backend-architecture.md', type: 'moderate', label: 'docs/02-platform-architecture/11-backend-architecture.md' },
  { value: 'docs/02-platform-architecture/12-database-architecture.md', type: 'moderate', label: 'docs/02-platform-architecture/12-database-architecture.md' },
  { value: 'docs/05-growth-systems/01-content-engine.md', type: 'moderate', label: 'docs/05-growth-systems/01-content-engine.md' },
  { value: 'docs/05-growth-systems/05-crm-integration.md', type: 'moderate', label: 'docs/05-growth-systems/05-crm-integration.md' },
  { value: 'docs/06-data-systems/03-deterministic-validation.md', type: 'moderate', label: 'docs/06-data-systems/03-deterministic-validation.md' },
  { value: 'docs/06-data-systems/04-audit-and-logging.md', type: 'moderate', label: 'docs/06-data-systems/04-audit-and-logging.md' },
  { value: 'docs/07-platform-operations/01-team-roles.md', type: 'moderate', label: 'docs/07-platform-operations/01-team-roles.md' },
  { value: 'docs/07-platform-operations/02-system-ownership.md', type: 'moderate', label: 'docs/07-platform-operations/02-system-ownership.md' },
  { value: 'docs/08-architecture-decisions/ADR-001-deterministic-intelligence.md', type: 'major', label: 'docs/08-architecture-decisions/ADR-001-deterministic-intelligence.md' },
  { value: 'docs/08-architecture-decisions/ADR-005-deterministic-first-ai.md', type: 'major', label: 'docs/08-architecture-decisions/ADR-005-deterministic-first-ai.md' },
  { value: 'docs/09-constitution-system/02-governance.md', type: 'minor', label: 'docs/09-constitution-system/02-governance.md' },
  { value: 'docs/09-constitution-system/04-update-process.md', type: 'minor', label: 'docs/09-constitution-system/04-update-process.md' },
]

const TYPE_LABELS = {
  minor: 'Minor — wording / links / cleanup',
  moderate: 'Moderate — architecture clarification',
  major: 'Major — platform philosophy or trust model',
}

export default function ProposeChange({ flash }: Props) {
  const [selectedDoc, setSelectedDoc] = useState('')
  const [changeType, setChangeType] = useState<'minor'|'moderate'|'major'>('minor')

  function handleDocChange(v: string) {
    setSelectedDoc(v)
    const opt = DOC_OPTIONS.find(d => d.value === v)
    if (opt) setChangeType(opt.type)
  }

  return (
    <div>
      <div className="ph">
        <div>
          <div className="pt">Propose a Constitution Change</div>
          <div className="ps">Admin + Super Admin · does not go live until approved by founder</div>
        </div>
      </div>
      <div className="two">
        <div className="card">
          <div className="ch"><div className="ct">Change Proposal</div></div>
          <div style={{padding:'14px 16px',display:'flex',flexDirection:'column',gap:12}}>
            <div>
              <div style={{fontSize:11,fontWeight:500,color:'var(--muted-fg)',marginBottom:5}}>DOCUMENT TO CHANGE</div>
              <select style={{width:'100%'}} value={selectedDoc} onChange={e => handleDocChange(e.target.value)}>
                <option value="">Select a Constitution document…</option>
                {DOC_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:500,color:'var(--muted-fg)',marginBottom:5}}>CHANGE TYPE</div>
              <select style={{width:'100%'}} value={changeType} onChange={e => setChangeType(e.target.value as typeof changeType)}>
                <option value="minor">{TYPE_LABELS.minor}</option>
                <option value="moderate">{TYPE_LABELS.moderate}</option>
                <option value="major">{TYPE_LABELS.major}</option>
              </select>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:500,color:'var(--muted-fg)',marginBottom:5}}>PROPOSED CHANGE</div>
              <textarea style={{width:'100%',height:100}} placeholder="Describe the change and why…"/>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:500,color:'var(--muted-fg)',marginBottom:5}}>EVIDENCE / GROUNDING</div>
              <textarea style={{width:'100%',height:70}} placeholder="What repo finding, implementation change, or decision prompted this?"/>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button className="btn btn-p" onClick={() => flash('Submitted for review')}>Submit for Review</button>
              <button className="btn" onClick={() => flash('Draft saved')}>Save Draft</button>
            </div>
          </div>
        </div>
        <div>
          <div className="card">
            <div className="ch"><div className="ct">Review Queue</div></div>
            <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>Proposed changes awaiting review will appear here.</div>
          </div>
          <div className="card">
            <div className="ch"><div className="ct">Governance rules</div></div>
            <div style={{padding:'10px 14px'}}>
              <div className="ar"><span style={{fontSize:11.5,color:'var(--muted-fg)'}}>Minor</span><span style={{fontSize:11.5}}>AI-assisted, normal review</span></div>
              <div className="ar"><span style={{fontSize:11.5,color:'var(--muted-fg)'}}>Moderate</span><span style={{fontSize:11.5}}>Nikhil review required</span></div>
              <div className="ar"><span style={{fontSize:11.5,color:'var(--muted-fg)'}}>Major</span><span style={{fontSize:11.5,color:'var(--wfg)',fontWeight:500}}>Founder approval required</span></div>
              <div className="ar"><span style={{fontSize:11.5,color:'var(--muted-fg)'}}>AI may not redefine</span><span style={{fontSize:11.5}}>Strategy, trust, or philosophy</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
