'use client'

import type { PageName, Role } from '@/lib/types'

interface Props { role: Role; go: (p: PageName) => void; flash: (m: string) => void }

export default function Pipelines(_props: Props) {
  return (
    <div>
      <div className="ph">
        <div>
          <div className="pt">Pipelines</div>
          <div className="ps">Data pipeline ownership · status · risk monitoring · docs/07-platform-operations/02-system-ownership.md</div>
        </div>
      </div>
      <div className="ss4">
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Active pipelines</div></div>
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Automated</div></div>
        <div className="sv"><div className="sv-v err">—</div><div className="sv-l">Manual / at-risk</div></div>
        <div className="sv"><div className="sv-v warn">—</div><div className="sv-l">TBD ownership</div></div>
      </div>
      <div className="card">
        <div className="ch">
          <div className="ct">Pipeline ownership</div>
          <div className="cs">Source: docs/07-platform-operations/02-system-ownership.md</div>
        </div>
        <div className="pipe-row">
          <div>
            <div className="pipe-name">Pipeline name</div>
            <div className="pipe-sub">Technical Owner · schedule</div>
          </div>
          <div className="pipe-r"><span className="badge bgr">—</span></div>
        </div>
        <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>Pipeline records populate from system ownership doc. Add pipeline owners via Constitution → Manage.</div>
      </div>
    </div>
  )
}
