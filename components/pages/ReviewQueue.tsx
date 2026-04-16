'use client'

import type { PageName, Role } from '@/lib/types'

interface Props { role: Role; go: (p: PageName) => void; flash: (m: string) => void }

export default function ReviewQueue(_props: Props) {
  return (
    <div>
      <div className="ph">
        <div>
          <div className="pt">Review Queue</div>
          <div className="ps">Super Admin · review proposed Constitution changes · approve or reject before Upload Changes</div>
        </div>
      </div>
      <div className="two">
        <div className="card">
          <div className="ch"><div className="ct">Pending proposals</div><div className="cs">Awaiting review</div></div>
          <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>
            No proposals awaiting review. Proposed changes submitted by the team will appear here.
          </div>
        </div>
        <div>
          <div className="card">
            <div className="ch"><div className="ct">Governance rules</div></div>
            <div style={{padding:'10px 14px'}}>
              <div className="ar"><span style={{fontSize:11.5,color:'var(--muted-fg)'}}>Minor</span><span style={{fontSize:11.5}}>AI-assisted, normal review</span></div>
              <div className="ar"><span style={{fontSize:11.5,color:'var(--muted-fg)'}}>Moderate</span><span style={{fontSize:11.5}}>Nikhil review required</span></div>
              <div className="ar"><span style={{fontSize:11.5,color:'var(--muted-fg)'}}>Major</span><span style={{fontSize:11.5,color:'var(--wfg)',fontWeight:500}}>Founder approval required</span></div>
              <div className="ar"><span style={{fontSize:11.5,color:'var(--muted-fg)'}}>Upload Changes</span><span style={{fontSize:11.5}}>Disabled until item approved here</span></div>
            </div>
          </div>
          <div className="card">
            <div className="ch"><div className="ct">Approved — ready to apply</div></div>
            <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>
              Approved changes will appear here. Run Upload Changes to apply.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
