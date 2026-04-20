import 'server-only'
import { CreateTeamMemberInput, validateResumeFile } from '@/lib/validation/team.schema'
import { insertTeamMember } from '@/lib/repositories/team.repository'
import { removeResume, uploadResume } from '@/lib/storage/resume.storage'
import { logger } from '@/lib/logger'
import { AppError, PayloadTooLargeError, UnsupportedMediaTypeError, ValidationError } from '@/lib/api/errors'
import type { MineralviewTeamMember } from '@/lib/types'

const log = logger.child('team.service')

export interface CreateTeamMemberParams {
  input: CreateTeamMemberInput
  resume: File | null
}

export async function createTeamMember(
  params: CreateTeamMemberParams
): Promise<MineralviewTeamMember> {
  const { input, resume } = params

  if (resume) {
    try {
      validateResumeFile(resume)
    } catch (err) {
      const e = err as Error & { code?: string }
      if (e.code === 'PAYLOAD_TOO_LARGE') throw new PayloadTooLargeError(e.message)
      if (e.code === 'UNSUPPORTED_MEDIA_TYPE') throw new UnsupportedMediaTypeError(e.message)
      throw new ValidationError(e.message)
    }
  }

  let uploadedPath: string | null = null

  try {
    if (resume) {
      const uploaded = await uploadResume({ file: resume, ownerSlugSeed: input.name })
      uploadedPath = uploaded.path
    }

    const member = await insertTeamMember({
      name: input.name,
      email: input.email,
      role: input.role ?? null,
      github_handle: input.github_handle ?? null,
      teams_handle: input.teams_handle ?? null,
      tags: input.tags ?? [],
      teams_channels: input.teams_channels ?? [],
      constitution_ownership: input.constitution_ownership ?? [],
      resume: uploadedPath,
      resume_status: uploadedPath ? 'uploaded' : 'missing',
      status: input.status ?? 'active',
    })

    log.info('team member created', { id: member.id, email: member.email })
    return member
  } catch (err) {
    if (uploadedPath) {
      log.warn('rolling back storage object after failure', { path: uploadedPath })
      await removeResume(uploadedPath)
    }
    if (err instanceof AppError) throw err
    throw err
  }
}
