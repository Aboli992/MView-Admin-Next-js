import SubmitUpdate from '@/components/reports/SubmitUpdate'
import '@/app/globals.css'

export const dynamic = 'force-dynamic'

export default function AdminReportsPage() {
  return (
    <div className="shell role-sa">
      <div className="main">
        <div className="content">
          <SubmitUpdate />
        </div>
      </div>
    </div>
  )
}
