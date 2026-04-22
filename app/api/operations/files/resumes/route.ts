import { listAllResumes } from '@/lib/services/files.service'
import { handleError, newRequestId, ok } from '@/lib/api/response'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const log = logger.child('api.operations.files.resumes')

export async function GET(): Promise<Response> {
  const requestId = newRequestId()
  const start = Date.now()

  try {
    log.info('GET /api/operations/files/resumes', { requestId })

    const rows = await listAllResumes()

    log.info('GET /api/operations/files/resumes completed', {
      requestId,
      count: rows.length,
      durationMs: Date.now() - start,
    })

    return ok(rows, {
      meta: {
        requestId,
        count: rows.length,
        uploaded: rows.filter((r) => r.url).length,
      },
    })
  } catch (err) {
    return handleError(err, requestId)
  }
}
