'use client'

import type { Role } from '@/lib/types'

interface Props {
  crumb: string
  role: Role
  setRole: (r: Role) => void
}

export default function Topbar({ crumb, role, setRole }: Props) {
  // Render crumb with · as separator (bold last segment)
  const parts = crumb.split(' · ')
  const crumbEl = parts.length > 1
    ? <>{parts.slice(0, -1).join(' · ')} · <b>{parts[parts.length - 1]}</b></>
    : <b>{crumb}</b>

  return (
    <div className="topbar">
      <div className="tb-bc">{crumbEl}</div>
      <div className="tb-r">
        <div style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'var(--muted-fg)'}}>
          <span className="dot-live"/>Live
        </div>
        <div className="role-sw">
          <div className={`rsw${role === 'user' ? ' on' : ''}`} onClick={() => setRole('user')}>User</div>
          <div className={`rsw${role === 'admin' ? ' on' : ''}`} onClick={() => setRole('admin')}>Admin</div>
          <div className={`rsw sa${role === 'sa' ? ' on' : ''}`} onClick={() => setRole('sa')}>Super Admin</div>
        </div>
        <select style={{fontSize:11,padding:'3px 8px'}}>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
        </select>
      </div>
    </div>
  )
}
