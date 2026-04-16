'use client'

import type { PageName, Role } from '@/lib/types'

interface Props { role: Role; go: (p: PageName) => void; flash: (m: string) => void }

const COMMON_QUERIES = [
  '"What are the five canonical mineral owner personas?"',
  '"What is the Three Brain Architecture?"',
  '"What triggers a Constitution update?"',
  '"What are the AI guardrails?"',
  '"What does ADR-005 say about deterministic-first AI?"',
  '"What is the content engine routing model?"',
]

const DOC_SECTIONS = [
  { label: '00 — System', count: '7 docs', sample: 'docs/00-system/01-three-brain-architecture.md' },
  { label: '01 — Foundations', count: '14 docs', sample: 'docs/01-foundations/06-trust-determinism-model.md' },
  { label: '02 — Platform Architecture', count: '17 docs', sample: 'docs/02-platform-architecture/11-backend-architecture.md' },
  { label: '03 — Intelligence Systems', count: '9 docs', sample: 'docs/03-intelligence-systems/10-deterministic-engine.md' },
  { label: '05 — Growth Systems', count: '6 docs', sample: 'docs/05-growth-systems/01-content-engine.md' },
  { label: '06 — Data Systems', count: '5 docs', sample: 'docs/06-data-systems/03-deterministic-validation.md' },
  { label: '07 — Platform Operations', count: '14 docs', sample: 'docs/07-platform-operations/02-system-ownership.md' },
  { label: '08 — Architecture Decisions', count: '5 ADRs', sample: 'docs/08-architecture-decisions/ADR-001 through ADR-005' },
  { label: '09 — Constitution System', count: '13 docs', sample: 'docs/09-constitution-system/02-governance.md' },
]

export default function Constitution({ flash }: Props) {
  return (
    <div>
      <div className="ph">
        <div>
          <div className="pt">Constitution</div>
          <div className="ps">Read · search · ask questions · all roles have access</div>
        </div>
      </div>
      <div className="two">
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className="const-chat">
            <div className="const-msg ai">
              Ask any question about MineralView architecture, platform decisions, team roles, or system design. All responses cite the source Constitution document.
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <input className="const-input" type="text" placeholder="Ask the Constitution anything about MineralView…"/>
            <button className="btn btn-p" onClick={() => flash('Constitution query coming soon')}>Ask</button>
          </div>
          <div style={{fontSize:11,color:'var(--muted-fg)'}}>Grounded in MineralView Constitution · Responses cite source documents · AI may not redefine platform meaning</div>
        </div>
        <div>
          <div className="card">
            <div className="ch"><div className="ct">Browse Constitution</div></div>
            {DOC_SECTIONS.map(s => (
              <div key={s.label}>
                <div className="const-doc-row">
                  <span style={{fontSize:12,fontWeight:500}}>{s.label}</span>
                  <span className="badge bgr">{s.count}</span>
                </div>
                <div className="const-doc-row">
                  <div className="const-doc-path">{s.sample}</div>
                  <button className="btn btn-sm" onClick={() => flash('Opening doc…')}>Read</button>
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="ch"><div className="ct">Common queries</div></div>
            {COMMON_QUERIES.map(q => (
              <div key={q} className="er" style={{cursor:'pointer'}}>
                <div className="em">{q}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
