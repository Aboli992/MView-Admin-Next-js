'use client'

import type { PageName, Role } from '@/lib/types'

interface Props { role: Role; go: (p: PageName) => void; flash: (m: string) => void }

export default function SubmitUpdate({ flash }: Props) {
  return (
    <div>
      <div className="ph">
        <div>
          <div className="pt">Submit Daily Update</div>
          <div className="ps">Post your update here · replaces Teams daily posts</div>
        </div>
      </div>
      <div className="two">
        <div className="card">
          <div className="ch"><div className="ct">Daily update form</div></div>
          <div style={{padding:'14px 16px',display:'flex',flexDirection:'column',gap:12}}>
            <div>
              <div style={{fontSize:11,fontWeight:500,color:'var(--muted-fg)',marginBottom:5}}>YOUR NAME</div>
              <select style={{width:'100%'}}><option value="">Select your name…</option></select>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:500,color:'var(--muted-fg)',marginBottom:5}}>ANY BLOCKERS?</div>
              <select style={{width:'100%'}}>
                <option>No blockers</option>
                <option>Yes — describe below</option>
              </select>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:500,color:'var(--muted-fg)',marginBottom:5}}>WHAT DID YOU WORK ON TODAY?</div>
              <textarea style={{width:'100%',height:100,fontSize:12}} placeholder="Describe what you worked on, what you completed, and any progress toward current goals…"/>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:500,color:'var(--muted-fg)',marginBottom:5}}>NEXT WEEK PLAN</div>
              <textarea style={{width:'100%',height:60,fontSize:12}} placeholder="What are you planning to work on next week?"/>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:500,color:'var(--muted-fg)',marginBottom:5}}>ATTACH FILE (optional)</div>
              <div style={{border:'.5px dashed var(--border)',borderRadius:6,padding:16,textAlign:'center',fontSize:12,color:'var(--muted-fg)',cursor:'pointer'}}>
                Drop file or click to upload
              </div>
            </div>
            <button className="btn btn-p" onClick={() => flash('Update submitted')}>Submit Update</button>
            <div style={{fontSize:11,color:'var(--muted-fg)'}}>Feeds directly into Daily Pulse and compiles into Weekly Report. No Teams post needed.</div>
          </div>
        </div>
        <div className="card">
          <div className="ch"><div className="ct">Today&apos;s submissions</div></div>
          <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>No submissions yet today.</div>
        </div>
      </div>
    </div>
  )
}
