import { getTodayDailyUpdates } from '@/lib/services/daily-update.service'
import { handleError, newRequestId, ok } from '@/lib/api/response'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const log = logger.child('api.daily-updates.today')

export async function GET(): Promise<Response> {
  const requestId = newRequestId()
  const start = Date.now()

  try {
    log.info('GET /api/daily-updates/today', { requestId })

    const records = await getTodayDailyUpdates()

    log.info('GET /api/daily-updates/today completed', {
      requestId,
      count: records.length,
      durationMs: Date.now() - start,
    })

    return ok(records, { meta: { requestId, count: records.length } })
  } catch (err) {
    return handleError(err, requestId)
  }
}
