import { z } from 'zod'

export const MEMBER_STATUS = ['active', 'inactive', 'leave', 'onboarding'] as const
export const RESUME_STATUS = ['missing', 'pending', 'uploaded'] as const

export const constitutionOwnershipSchema = z.object({
  section: z.string().min(1, 'section is required'),
  path: z.string().optional(),
})

const tagsFromUnknown = z
  .union([z.array(z.string()), z.string()])
  .transform((val) => {
    if (Array.isArray(val)) return val
    const trimmed = val.trim()
    if (!trimmed) return []
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed)
        return Array.isArray(parsed) ? parsed.map(String) : []
      } catch {
        return []
      }
    }
    return trimmed.split(',').map((t) => t.trim()).filter(Boolean)
  })
  .pipe(z.array(z.string().min(1)).max(50))

const ownershipFromUnknown = z
  .union([z.array(constitutionOwnershipSchema), z.string()])
  .transform((val) => {
    if (Array.isArray(val)) return val
    const trimmed = val.trim()
    if (!trimmed) return []
    try {
      const parsed = JSON.parse(trimmed)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })
  .pipe(z.array(constitutionOwnershipSchema).max(100))

export const createTeamMemberSchema = z.object({
  name: z.string().trim().min(1, 'name is required').max(120),
  email: z.email('invalid email').trim().toLowerCase().max(255),
  role: z.string().trim().max(120).optional().nullable(),
  github_handle: z.string().trim().max(120).optional().nullable(),
  teams_handle: z.string().trim().max(120).optional().nullable(),
  tags: tagsFromUnknown.optional().default([]),
  teams_channels: tagsFromUnknown.optional().default([]),
  constitution_ownership: ownershipFromUnknown.optional().default([]),
  status: z.enum(MEMBER_STATUS).optional().default('active'),
})

export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>

export const updateTeamMemberSchema = z
  .object({
    name: z.string().trim().min(1, 'name is required').max(120).optional(),
    email: z.email('invalid email').trim().toLowerCase().max(255).optional(),
    role: z.string().trim().max(120).optional().nullable(),
    github_handle: z.string().trim().max(120).optional().nullable(),
    teams_handle: z.string().trim().max(120).optional().nullable(),
    tags: tagsFromUnknown.optional(),
    teams_channels: tagsFromUnknown.optional(),
    constitution_ownership: ownershipFromUnknown.optional(),
    status: z.enum(MEMBER_STATUS).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: 'at least one field must be provided',
  })

export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>

export const RESUME_MAX_BYTES = 10 * 1024 * 1024 // 10 MB
export const RESUME_ALLOWED_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const

export function validateResumeFile(file: File): void {
  if (file.size === 0) {
    throw Object.assign(new Error('resume file is empty'), { code: 'VALIDATION' })
  }
  if (file.size > RESUME_MAX_BYTES) {
    throw Object.assign(new Error(`resume file exceeds ${RESUME_MAX_BYTES} bytes`), {
      code: 'PAYLOAD_TOO_LARGE',
    })
  }
  if (!RESUME_ALLOWED_MIME.includes(file.type as (typeof RESUME_ALLOWED_MIME)[number])) {
    throw Object.assign(
      new Error(`unsupported resume type: ${file.type || 'unknown'}. Allowed: PDF, DOC, DOCX`),
      { code: 'UNSUPPORTED_MEDIA_TYPE' }
    )
  }
}
