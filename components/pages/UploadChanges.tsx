'use client'

import type { PageName, Role } from '@/lib/types'

interface Props { role: Role; go: (p: PageName) => void; flash: (m: string) => void }

const SCRIPTS = [
  { name: '00-constitution-state.py', desc: 'Generate current state snapshot of Constitution and repos' },
  { name: '01-repo-audit.py', desc: 'Audit all repositories for architecture drift and inventory gaps' },
  { name: '02-constitution-assessment.py', desc: 'Assess completeness against current platform state' },
  { name: '04-apply-approved-updates.py', desc: 'Apply all approved changes from the review queue' },
  { name: '05-generate-docs-bundle.py', desc: 'Generate documentation bundle for knowledge refresh' },
  { name: '07-auto-draft-engine.py', desc: 'Generate AI-assisted draft updates for pending sections' },
]

const CHECKLIST = [
  '1. Apply approved updates',
  '2. Regenerate repo manifest',
  '3. Generate docs bundle',
  '4. Refresh assistant config',
  '5. Verify links and index',
]

export default function UploadChanges({ flash }: Props) {
  return (
    <div>
      <div className="ph">
        <div>
          <div className="pt">Upload Constitution Changes</div>
          <div className="ps">Super Admin only · run update scripts · requires approved changes in queue</div>
        </div>
      </div>
      <div className="two">
        <div className="card">
          <div className="ch"><div className="ct">Update scripts</div><div className="cs">Run in sequence</div></div>
          {SCRIPTS.map(s => (
            <div key={s.name} className="script-row">
              <div>
                <div className="script-n">{s.name}</div>
                <div className="script-d">{s.desc}</div>
              </div>
              <div className="script-r">
                <span className="badge bgr">Not run</span>
                <button className="btn btn-sm" onClick={() => flash(`Running ${s.name}…`)}>Run</button>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="card">
            <div className="ch"><div className="ct">Recent run log</div></div>
            <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>Script run history will appear here.</div>
          </div>
          <div className="card">
            <div className="ch"><div className="ct">Post-merge checklist</div></div>
            <div style={{padding:'10px 14px'}}>
              {CHECKLIST.map(item => (
                <div key={item} className="ar">
                  <span style={{fontSize:11.5,color:'var(--muted-fg)'}}>{item}</span>
                  <span className="badge bgr">Pending</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
