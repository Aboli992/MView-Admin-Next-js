import { NextRequest } from 'next/server'
import { createDailyUpdate } from '@/lib/services/daily-update.service'
import { createDailyUpdateSchema } from '@/lib/validation/daily-update.schema'
import { handleError, newRequestId, ok } from '@/lib/api/response'
import { UnsupportedMediaTypeError } from '@/lib/api/errors'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const log = logger.child('api.daily-updates')

async function parseRequestBody(
  req: NextRequest
): Promise<{ payload: Record<string, unknown>; attachment: File | null }> {
  const contentType = req.headers.get('content-type') ?? ''

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData()
    const entry = form.get('attachment')
    const attachment = entry instanceof File && entry.size > 0 ? entry : null

    const payload: Record<string, unknown> = {}
    for (const [key, value] of form.entries()) {
      if (key === 'attachment') continue
      payload[key] = typeof value === 'string' ? value : undefined
    }
    return { payload, attachment }
  }

  if (contentType.includes('application/json')) {
    const json = (await req.json()) as Record<string, unknown>
    return { payload: json, attachment: null }
  }

  throw new UnsupportedMediaTypeError(
    'Content-Type must be application/json or multipart/form-data'
  )
}

export async function POST(req: NextRequest): Promise<Response> {
  const requestId = newRequestId()
  const start = Date.now()

  try {
    log.info('POST /api/daily-updates', { requestId })

    const { payload, attachment } = await parseRequestBody(req)
    const input = createDailyUpdateSchema.parse(payload)

    const record = await createDailyUpdate({ input, attachment })

    log.info('POST /api/daily-updates completed', {
      requestId,
      id: record.id,
      durationMs: Date.now() - start,
    })

    return ok(record, { status: 201, meta: { requestId } })
  } catch (err) {
    return handleError(err, requestId)
  }
}
