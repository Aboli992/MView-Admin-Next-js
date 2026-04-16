'use client'

import { useState } from 'react'
import type { PageName, Role } from '@/lib/types'

interface Props { role: Role; go: (p: PageName) => void; flash: (m: string) => void }

export default function WeeklyReports({ flash }: Props) {
  const [activeTab, setActiveTab] = useState<'current'|'previous'|'saved'>('current')

  return (
    <div>
      <div className="ph">
        <div>
          <div className="pt">Weekly Reports</div>
          <div className="ps">Compiled from daily pulse submissions · auto-generated end of week</div>
        </div>
        <div className="ph-r">
          <button className="btn btn-p btn-sm" onClick={() => flash('Exporting…')}>↓ Export</button>
        </div>
      </div>

      <div className="tabs">
        <div className={`tab${activeTab === 'current' ? ' on' : ''}`} onClick={() => setActiveTab('current')}>Current week</div>
        <div className={`tab${activeTab === 'previous' ? ' on' : ''}`} onClick={() => setActiveTab('previous')}>Previous week</div>
        <div className={`tab${activeTab === 'saved' ? ' on' : ''}`} onClick={() => setActiveTab('saved')}>All saved</div>
      </div>

      {activeTab === 'current' && (
        <>
          <div className="ss5">
            <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Updates submitted</div></div>
            <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Aligned</div></div>
            <div className="sv"><div className="sv-v warn">—</div><div className="sv-l">Constitution signals</div></div>
            <div className="sv"><div className="sv-v err">—</div><div className="sv-l">No update</div></div>
            <div className="sv"><div className="sv-v" style={{color:'var(--muted-fg)'}}>—</div><div className="sv-l">On leave</div></div>
          </div>
          <div className="card">
            <div className="ch"><div className="ct">Current week — member summary</div><div className="cs">Compiled from daily submissions</div></div>
            <table>
              <thead><tr><th>Member</th><th>Team</th><th>This week</th><th>Next week</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td colSpan={5} style={{textAlign:'center',color:'var(--muted-fg)',padding:32,fontSize:12}}>Weekly report compiles automatically from daily pulse submissions. Data will appear here as the week progresses.</td></tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'previous' && (
        <div className="card">
          <div className="ch"><div className="ct">Previous week — summary</div></div>
          <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>Previous weekly report will appear here once archived.</div>
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="card">
          <div className="ch">
            <div className="ct">All saved weekly reports</div>
            <button className="btn btn-sm" onClick={() => flash('Exporting all…')}>↓ Export all</button>
          </div>
          <div style={{padding:32,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>Saved reports will appear here as weeks are archived.</div>
        </div>
      )}
    </div>
  )
}
