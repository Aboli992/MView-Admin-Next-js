import { NextRequest } from 'next/server'
import { deleteTeamMember, updateTeamMember } from '@/lib/services/team.service'
import { updateTeamMemberSchema } from '@/lib/validation/team.schema'
import { handleError, newRequestId, ok } from '@/lib/api/response'
import { UnsupportedMediaTypeError, ValidationError } from '@/lib/api/errors'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const log = logger.child('api.team.[id]')

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

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  const requestId = newRequestId()
  const start = Date.now()

  try {
    const { id } = await context.params
    if (!id) throw new ValidationError('id is required')

    log.info('PATCH /api/team/[id]', { requestId, id })

    const { payload, resume } = await parseRequestBody(req)
    const input = updateTeamMemberSchema.parse(payload)

    const member = await updateTeamMember({ id, input, resume })

    log.info('PATCH /api/team/[id] completed', {
      requestId,
      id: member.id,
      durationMs: Date.now() - start,
    })

    return ok(member, { meta: { requestId } })
  } catch (err) {
    return handleError(err, requestId)
  }
}

export const PUT = PATCH
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  const requestId = newRequestId()
  const start = Date.now()

  try {
    const { id } = await context.params
    if (!id) throw new ValidationError('id is required')

    log.info('DELETE /api/team/[id]', { requestId, id })

    const member = await deleteTeamMember(id)

    log.info('DELETE /api/team/[id] completed', {
      requestId,
      id,
      durationMs: Date.now() - start,
    })

    return ok(
      { id: member.id, deleted: true },
      { meta: { requestId } }
    )
  } catch (err) {
    return handleError(err, requestId)
  }
}
