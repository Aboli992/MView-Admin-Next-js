'use client'

import type { PageName, Role, TeamMember } from '@/lib/types'
import { PULSE_TEAM } from '@/lib/pulseTeam'

interface Props { role: Role; go: (p: PageName) => void; flash: (m: string) => void }

const PULSE_BADGE: Record<string, React.ReactNode> = {
  aligned:    <span className="badge bg">Aligned</span>,
  flag:       <span className="badge ba">Flag</span>,
  'no-update':<span className="badge br">No update</span>,
  leave:      <span className="badge bgr">On leave</span>,
  onboarding: <span className="badge bgr">Onboarding</span>,
}

function PulseCard({ m, onAck }: { m: TeamMember; onAck: () => void }) {
  return (
    <div className="pc">
      <div className={`pc-stripe stripe-${m.stripe}`}/>
      <div className="pc-body-inner">
        <div className="pc-top2">
          <div className={`ava2 ${m.avaClass}`}>{m.initials}</div>
          <div className="pc-info2">
            <div className="pc-name2">{m.name}</div>
            <div className="pc-meta2">{m.role}</div>
          </div>
          <div>{PULSE_BADGE[m.status] ?? PULSE_BADGE.aligned}</div>
        </div>
        {m.flag && (
          <div className={`pc-flag2${m.status === 'no-update' ? ' red' : ''}`}>{m.flag}</div>
        )}
        {m.update && (
          <div className={`pc-update2${m.status === 'leave' || m.status === 'onboarding' ? ' muted' : ''}`}>{m.update}</div>
        )}
        {m.next && (
          <div className="pc-next2"><span className="pc-next-lbl">Next</span>{m.next}</div>
        )}
        {m.tags.length > 0 && (
          <div className="pc-tags2">{m.tags.map(t => <span key={t} className="pc-tag">{t}</span>)}</div>
        )}
        <div className="pc-footer2">
          <span style={{fontFamily:'monospace',fontSize:10,color:'var(--muted-fg)'}}>{m.constRef}</span>
          <div style={{display:'flex',gap:5}}>
            {m.status === 'no-update' && (
              <button className="pc-act2 warn">Send Reminder</button>
            )}
            {m.draftResponse && m.status !== 'no-update' && (
              <>
                <button className="pc-act2" onClick={onAck}>Ack</button>
                <button className="pc-act2 primary">Draft Response</button>
              </>
            )}
            {!m.draftResponse && m.status !== 'no-update' && m.status !== 'leave' && m.status !== 'onboarding' && (
              <button className="pc-act2" onClick={onAck}>Ack</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DailyPulse({ go, flash }: Props) {
  const flags  = PULSE_TEAM.filter(m => m.status === 'flag' || m.status === 'no-update')
  const core   = PULSE_TEAM.filter(m => m.team === 'core'   && m.status !== 'flag' && m.status !== 'no-update')
  const growth = PULSE_TEAM.filter(m => m.team === 'growth' && m.status !== 'flag' && m.status !== 'no-update')

  const sub = PULSE_TEAM.filter(m => m.status !== 'leave' && m.status !== 'onboarding' && m.status !== 'no-update').length
  const aln = PULSE_TEAM.filter(m => m.status === 'aligned').length
  const rv  = PULSE_TEAM.filter(m => m.status === 'flag' || m.status === 'no-update').length
  const ms  = PULSE_TEAM.filter(m => m.status === 'no-update').length
  const lv  = PULSE_TEAM.filter(m => m.status === 'leave' || m.status === 'onboarding').length

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(310px,1fr))',
    gap: 12,
    marginBottom: 20,
  }

  return (
    <div>
      <div className="ph">
        <div>
          <div className="pt">Daily Pulse</div>
          <div className="ps">Live team updates · today&apos;s date · replaces Teams daily posts</div>
        </div>
        <div className="ph-r">
          <span style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'var(--muted-fg)'}}>
            <span className="dot-live"/>Live
          </span>
          <button className="btn btn-p btn-sm" onClick={() => go('ops-submit')}>+ Submit Update</button>
        </div>
      </div>

      <div className="ss5">
        <div className="sv"><div className="sv-v ok">{sub || '—'}</div><div className="sv-l">Updates submitted</div></div>
        <div className="sv"><div className="sv-v ok">{aln || '—'}</div><div className="sv-l">Aligned</div></div>
        <div className="sv"><div className="sv-v warn">{rv || '—'}</div><div className="sv-l">Needs review</div></div>
        <div className="sv"><div className="sv-v err">{ms || '—'}</div><div className="sv-l">No update</div></div>
        <div className="sv"><div className="sv-v" style={{color:'var(--muted-fg)'}}>{lv || '—'}</div><div className="sv-l">On leave</div></div>
      </div>

      <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
        <button className="btn btn-sm" style={{background:'var(--p12)',color:'var(--pfg)',borderColor:'var(--p18)'}}>All teams</button>
        <button className="btn btn-sm">@core</button>
        <button className="btn btn-sm">@growth</button>
        <button className="btn btn-sm">Flags only</button>
      </div>

      <div style={{fontSize:11,fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted-fg)',marginBottom:10,paddingBottom:6,borderBottom:'.5px solid var(--border)'}}>
        Needs attention
      </div>
      <div style={gridStyle}>
        {flags.length > 0
          ? flags.map(m => <PulseCard key={m.name} m={m} onAck={() => flash('Acknowledged')} />)
          : <div style={{padding:24,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>No flags today — all submitted updates aligned.</div>
        }
      </div>

      <div style={{fontSize:11,fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted-fg)',marginBottom:10,paddingBottom:6,borderBottom:'.5px solid var(--border)'}}>
        @core team
      </div>
      <div style={gridStyle}>
        {core.length > 0
          ? core.map(m => <PulseCard key={m.name} m={m} onAck={() => flash('Acknowledged')} />)
          : <div style={{padding:24,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>No @core updates yet.</div>
        }
      </div>

      <div style={{fontSize:11,fontWeight:600,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted-fg)',marginBottom:10,paddingBottom:6,borderBottom:'.5px solid var(--border)'}}>
        @growth team
      </div>
      <div style={gridStyle}>
        {growth.length > 0
          ? growth.map(m => <PulseCard key={m.name} m={m} onAck={() => flash('Acknowledged')} />)
          : <div style={{padding:24,textAlign:'center',color:'var(--muted-fg)',fontSize:12}}>No @growth updates yet.</div>
        }
      </div>
    </div>
  )
}
