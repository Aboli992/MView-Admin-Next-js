import 'server-only'
import {
  CreateTeamMemberInput,
  UpdateTeamMemberInput,
  validateResumeFile,
} from '@/lib/validation/team.schema'
import {
  deleteTeamMemberById,
  findTeamMemberById,
  insertTeamMember,
  listTeamMemberSummaries,
  listTeamMembers,
  TeamMemberSummary,
  updateTeamMemberById,
} from '@/lib/repositories/team.repository'
import { removeResume, uploadResume } from '@/lib/storage/resume.storage'
import { logger } from '@/lib/logger'
import {
  AppError,
  NotFoundError,
  PayloadTooLargeError,
  UnsupportedMediaTypeError,
  ValidationError,
} from '@/lib/api/errors'
import type { MineralviewTeamMember } from '@/lib/types'

const log = logger.child('team.service')

export interface CreateTeamMemberParams {
  input: CreateTeamMemberInput
  resume: File | null
}

export async function getAllTeamMembers(): Promise<MineralviewTeamMember[]> {
  const members = await listTeamMembers()
  log.info('team members listed', { count: members.length })
  return members
}

export async function getTeamMemberSummaries(): Promise<TeamMemberSummary[]> {
  const summaries = await listTeamMemberSummaries()
  log.info('team member summaries listed', { count: summaries.length })
  return summaries
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

export interface UpdateTeamMemberParams {
  id: string
  input: UpdateTeamMemberInput
  resume?: File | null
}

export async function updateTeamMember(
  params: UpdateTeamMemberParams
): Promise<MineralviewTeamMember> {
  const { id, input, resume } = params

  const existing = await findTeamMemberById(id)
  if (!existing) throw new NotFoundError(`Team member "${id}" not found`)

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

  const patch: Record<string, unknown> = {}
  if (input.name !== undefined) patch.name = input.name
  if (input.email !== undefined) patch.email = input.email
  if (input.role !== undefined) patch.role = input.role
  if (input.github_handle !== undefined) patch.github_handle = input.github_handle
  if (input.teams_handle !== undefined) patch.teams_handle = input.teams_handle
  if (input.tags !== undefined) patch.tags = input.tags
  if (input.teams_channels !== undefined) patch.teams_channels = input.teams_channels
  if (input.constitution_ownership !== undefined) {
    patch.constitution_ownership = input.constitution_ownership
  }
  if (input.status !== undefined) patch.status = input.status

  let uploadedPath: string | null = null

  try {
    if (resume) {
      const uploaded = await uploadResume({
        file: resume,
        ownerSlugSeed: input.name ?? existing.name,
      })
      uploadedPath = uploaded.path
      patch.resume = uploadedPath
      patch.resume_status = 'uploaded'
    }

    const member = await updateTeamMemberById(id, patch as never)

    if (uploadedPath && existing.resume && existing.resume !== uploadedPath) {
      log.info('removing previous resume', { path: existing.resume })
      await removeResume(existing.resume)
    }

    log.info('team member updated', { id: member.id })
    return member
  } catch (err) {
    if (uploadedPath) {
      log.warn('rolling back storage object after update failure', { path: uploadedPath })
      await removeResume(uploadedPath)
    }
    if (err instanceof AppError) throw err
    throw err
  }
}

export async function deleteTeamMember(id: string): Promise<MineralviewTeamMember> {
  const existing = await findTeamMemberById(id)
  if (!existing) throw new NotFoundError(`Team member "${id}" not found`)

  const removed = await deleteTeamMemberById(id)

  if (removed.resume) {
    log.info('removing resume on delete', { path: removed.resume })
    await removeResume(removed.resume)
  }

  log.info('team member deleted', { id })
  return removed
}
