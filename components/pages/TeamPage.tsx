'use client'

import type { PageName, Role } from '@/lib/types'

interface Props { role: Role; go: (p: PageName) => void; flash: (m: string) => void }

export default function TeamPage({ flash }: Props) {
  return (
    <div>
      <div className="ph">
        <div>
          <div className="pt">Team</div>
          <div className="ps">Roster · roles · emails · Constitution file ownership · notification triggers</div>
        </div>
        <div className="ph-r admin-only flex">
          <button className="btn btn-p btn-sm" onClick={() => flash('Add member coming soon')}>+ Add Member</button>
        </div>
      </div>
      <div className="ss4">
        <div className="sv"><div className="sv-v">—</div><div className="sv-l">Total members</div></div>
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">@core</div></div>
        <div className="sv"><div className="sv-v ok">—</div><div className="sv-l">@growth</div></div>
        <div className="sv"><div className="sv-v err">—</div><div className="sv-l">Resumes missing</div></div>
      </div>
      <div className="card">
        <div className="ch"><div className="ct">Team roster</div><div className="cs">All members · role · email · tags · Constitution ownership</div></div>
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Role</th><th>Email</th><th>Tags</th><th>Resume</th>
              <th>Constitution sections</th><th className="admin-only">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} style={{textAlign:'center',color:'var(--muted-fg)',padding:32,fontSize:12}}>
                Team member data will populate here from the Members &amp; Roles system. Add members via the + Add Member button.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
