'use client'

import type { PageName, Role } from '@/lib/types'

interface Props { role: Role; go: (p: PageName) => void; flash: (m: string) => void }

export default function QuarterlyReview({ flash }: Props) {
  return (
    <div>
      <div className="ph">
        <div>
          <div className="pt">Quarterly Review</div>
          <div className="ps">Auto-compiled from weekly reports · reviewed with leadership</div>
        </div>
        <div className="ph-r">
          <button className="btn btn-sm" onClick={() => flash('Exporting PDF…')}>↓ Export PDF</button>
        </div>
      </div>
      <div className="ss4">
        <div className="sv"><div className="sv-v">—</div><div className="sv-l">Members active</div></div>
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Weeks reported</div></div>
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Constitution flags resolved</div></div>
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Resumes on file</div></div>
      </div>
      <div className="card">
        <div className="ch"><div className="ct">Quarterly summary</div></div>
        <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>Quarterly review auto-compiles from weekly reports at end of each quarter.</div>
      </div>
    </div>
  )
}
