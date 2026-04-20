import { getTeamMemberSummaries } from '@/lib/services/team.service'
import { handleError, newRequestId, ok } from '@/lib/api/response'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const log = logger.child('api.team.summary')

export async function GET(): Promise<Response> {
  const requestId = newRequestId()
  const start = Date.now()

  try {
    log.info('GET /api/team/summary', { requestId })

    const summaries = await getTeamMemberSummaries()

    log.info('GET /api/team/summary completed', {
      requestId,
      count: summaries.length,
      durationMs: Date.now() - start,
    })

    return ok(summaries, {
      meta: { requestId, count: summaries.length },
    })
  } catch (err) {
    return handleError(err, requestId)
  }
}
