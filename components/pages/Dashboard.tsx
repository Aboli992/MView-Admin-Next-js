'use client'

import { useState } from 'react'
import type { PageName, Role } from '@/lib/types'

interface Props { role: Role; go: (p: PageName) => void; flash: (m: string) => void }

export default function Dashboard({ go }: Props) {
  const [activeTab, setActiveTab] = useState<'pipeline'|'marketing'|'intelligence'>('pipeline')

  return (
    <div>
      <div className="ph">
        <div>
          <div className="pt">Dashboard</div>
          <div className="ps">Owner lifecycle · campaigns · entity intelligence · real-time</div>
        </div>
      </div>

      <div className="ss5">
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Mineral Owners</div></div>
        <div className="sv"><div className="sv-v warn">—</div><div className="sv-l">Claims In Progress</div></div>
        <div className="sv"><div className="sv-v">—</div><div className="sv-l">ROAS (7d)</div></div>
        <div className="sv"><div className="sv-v warn">—</div><div className="sv-l">Stale LLMO Pages</div></div>
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Live Entity Pages</div></div>
      </div>

      <div className="tabs">
        <div className={`tab${activeTab === 'pipeline' ? ' on' : ''}`} onClick={() => setActiveTab('pipeline')}>Owner Pipeline</div>
        <div className={`tab${activeTab === 'marketing' ? ' on' : ''}`} onClick={() => setActiveTab('marketing')}>Marketing Performance</div>
        <div className={`tab${activeTab === 'intelligence' ? ' on' : ''}`} onClick={() => setActiveTab('intelligence')}>Entity Intelligence</div>
      </div>

      {activeTab === 'pipeline' && (
        <>
          <div className="card" style={{marginBottom:14}}>
            <div className="ch"><div className="ct">Constitution Health</div><div className="cs">Completeness · open proposals · last update</div></div>
            <div style={{padding:'10px 14px',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
              <div><div className="sv-v" style={{fontSize:20,fontWeight:600,color:'var(--muted-fg)'}}>—</div><div style={{fontSize:10,color:'var(--muted-fg)',marginTop:4}}>Completeness</div></div>
              <div><div className="sv-v warn" style={{fontSize:20,fontWeight:600}}>—</div><div style={{fontSize:10,color:'var(--muted-fg)',marginTop:4}}>Open proposals</div></div>
              <div><div className="sv-v ok" style={{fontSize:20,fontWeight:600}}>—</div><div style={{fontSize:10,color:'var(--muted-fg)',marginTop:4}}>Last updated</div></div>
              <div><div className="sv-v" style={{fontSize:20,fontWeight:600,color:'var(--muted-fg)'}}>—</div><div style={{fontSize:10,color:'var(--muted-fg)',marginTop:4}}>Misalignment scan</div></div>
            </div>
          </div>
          <div className="two">
            <div className="card">
              <div className="ch"><div className="ct">Owner Funnel</div><div className="cs">Last 30 days</div></div>
              <div style={{padding:'12px 14px'}}>
                {[
                  ['Identified (email captured)','—'],
                  ['Intelligence Query Submitted','—'],
                  ['Statement Uploaded','—'],
                  ['Claim Started','—'],
                  ['Claim Completed','—'],
                ].map(([label, val], i) => (
                  <div key={i} className="ar">
                    <span style={{fontSize:12,color:'var(--muted-fg)'}}>{label}</span>
                    <span style={{fontSize:12,fontWeight:600,color: i === 4 ? 'var(--ok)' : undefined}}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="ch"><div className="ct">Team Pulse Today</div><div className="cs">Submitted today</div></div>
              <div style={{padding:'10px 14px'}}>
                <div className="ar"><span style={{fontSize:12,color:'var(--muted-fg)'}}>Updates in</span><span className="badge bg">—</span></div>
                <div className="ar"><span style={{fontSize:12,color:'var(--muted-fg)'}}>Flags requiring review</span><span className="badge ba">—</span></div>
                <div className="ar"><span style={{fontSize:12,color:'var(--muted-fg)'}}>No update</span><span className="badge br">—</span></div>
                <div className="ar"><span style={{fontSize:12,color:'var(--muted-fg)'}}>On leave</span><span className="badge bgr">—</span></div>
                <div style={{marginTop:10}}>
                  <button className="btn btn-p btn-sm" onClick={() => go('ops-pulse')}>View Daily Pulse →</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'marketing' && (
        <div className="ss4">
          <div className="sv"><div className="sv-v">—</div><div className="sv-l">Ad Spend (7d)</div></div>
          <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">ROAS</div></div>
          <div className="sv"><div className="sv-v">—</div><div className="sv-l">Intelligence Queries</div></div>
          <div className="sv"><div className="sv-v warn">—</div><div className="sv-l">Stale LLMO Pages</div></div>
        </div>
      )}

      {activeTab === 'intelligence' && (
        <div className="ss3">
          <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">Live Entity Pages</div></div>
          <div className="sv"><div className="sv-v warn">—</div><div className="sv-l">Stale Pages</div></div>
          <div className="sv"><div className="sv-v">—</div><div className="sv-l">Operator Pages</div></div>
        </div>
      )}
    </div>
  )
}
