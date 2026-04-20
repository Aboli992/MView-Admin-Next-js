import { NextRequest } from 'next/server'
import { createTeamMember } from '@/lib/services/team.service'
import { createTeamMemberSchema } from '@/lib/validation/team.schema'
import { handleError, newRequestId, ok } from '@/lib/api/response'
import { UnsupportedMediaTypeError } from '@/lib/api/errors'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const log = logger.child('api.team')

async function parseRequestBody(
  req: NextRequest
): Promise<{ payload: Record<string, unknown>; resume: File | null }> {
  const contentType = req.headers.get('content-type') ?? ''

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData()
    const resumeEntry = form.get('resume')
    const resume =
      resumeEntry instanceof File && resumeEntry.size > 0 ? resumeEntry : null

    const payload: Record<string, unknown> = {}
    for (const [key, value] of form.entries()) {
      if (key === 'resume') continue
      payload[key] = typeof value === 'string' ? value : undefined
    }
    return { payload, resume }
  }

  if (contentType.includes('application/json')) {
    const json = (await req.json()) as Record<string, unknown>
    return { payload: json, resume: null }
  }

  throw new UnsupportedMediaTypeError(
    'Content-Type must be application/json or multipart/form-data'
  )
}

export async function POST(req: NextRequest): Promise<Response> {
  const requestId = newRequestId()
  const start = Date.now()

  try {
    log.info('POST /api/team', { requestId })

    const { payload, resume } = await parseRequestBody(req)
    const input = createTeamMemberSchema.parse(payload)

    const member = await createTeamMember({ input, resume })

    log.info('POST /api/team completed', {
      requestId,
      id: member.id,
      durationMs: Date.now() - start,
    })

    return ok(member, { status: 201, meta: { requestId } })
  } catch (err) {
    return handleError(err, requestId)
  }
}
