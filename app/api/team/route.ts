import { NextRequest } from 'next/server'
import { createTeamMember, getAllTeamMembers } from '@/lib/services/team.service'
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

function buildSummary(members: Awaited<ReturnType<typeof getAllTeamMembers>>) {
  const normalize = (v: string) => v.trim().toLowerCase().replace(/^[@#]+/, '')

  const hasLabel = (member: (typeof members)[number], label: string) => {
    const values = [...(member.tags ?? []), ...(member.teams_channels ?? [])]
    return values.some((v) => normalize(v) === label)
  }

  let core = 0
  let growth = 0
  let resumes_missing = 0

  for (const m of members) {
    if (hasLabel(m, 'core')) core += 1
    if (hasLabel(m, 'growth')) growth += 1
    if ((m.resume_status ?? 'missing') !== 'uploaded') resumes_missing += 1
  }

  return {
    total_members: members.length,
    core,
    growth,
    resumes_missing,
  }
}

export async function GET(): Promise<Response> {
  const requestId = newRequestId()
  const start = Date.now()

  try {
    log.info('GET /api/team', { requestId })

    const members = await getAllTeamMembers()
    const summary = buildSummary(members)

    log.info('GET /api/team completed', {
      requestId,
      count: members.length,
      durationMs: Date.now() - start,
    })

    return ok(members, {
      meta: { requestId, count: members.length, summary },
    })
  } catch (err) {
    return handleError(err, requestId)
  }
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
