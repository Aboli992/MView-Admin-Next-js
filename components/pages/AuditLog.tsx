'use client'

import type { PageName, Role } from '@/lib/types'

interface Props { role: Role; go: (p: PageName) => void; flash: (m: string) => void }

export default function AuditLog(_props: Props) {
  return (
    <div>
      <div className="ph">
        <div>
          <div className="pt">Constitution Audit Log</div>
          <div className="ps">All changes · approvals · rejections · all roles can view</div>
        </div>
      </div>
      <div className="card">
        <div className="ch"><div className="ct">Change history</div></div>
        <table>
          <thead>
            <tr><th>Document</th><th>Type</th><th>Proposed by</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} style={{textAlign:'center',color:'var(--muted-fg)',padding:32,fontSize:12}}>
                Constitution change history will appear here as proposals are submitted and reviewed.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
