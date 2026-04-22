import type { NextRequest } from 'next/server'
import { getWeeklyReport } from '@/lib/services/weekly-report.service'
import { handleError, newRequestId, ok } from '@/lib/api/response'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const log = logger.child('api.operations.weekly-report')

export async function GET(req: NextRequest): Promise<Response> {
  const requestId = newRequestId()
  const start = Date.now()

  try {
    const refParam = req.nextUrl.searchParams.get('date')
    const referenceDate = refParam ? new Date(refParam) : undefined

    if (referenceDate && Number.isNaN(referenceDate.getTime())) {
      log.warn('invalid date param', { requestId, date: refParam })
      return ok(null, {
        status: 400,
        meta: { requestId, error: 'Invalid date parameter; expected ISO date.' },
      })
    }

    log.info('GET /api/operations/weekly-report', { requestId, date: refParam ?? null })

    const report = await getWeeklyReport(referenceDate)

    log.info('GET /api/operations/weekly-report completed', {
      requestId,
      durationMs: Date.now() - start,
      current_members: report.current_week.members.length,
      previous_members: report.previous_week.members.length,
      weeks_covered: report.all_saved.summary.weeks_covered,
    })

    return ok(report, { meta: { requestId, generated_at: report.generated_at } })
  } catch (err) {
    return handleError(err, requestId)
  }
}
