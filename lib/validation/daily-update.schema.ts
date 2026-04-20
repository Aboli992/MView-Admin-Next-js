import { z } from 'zod'

export const BLOCKERS_STATUS = ['no_blockers', 'has_blockers'] as const

const coerceInt = z
  .union([z.number(), z.string()])
  .transform((v) => (typeof v === 'number' ? v : Number.parseInt(v, 10)))
  .pipe(z.number().int().positive())

export const createDailyUpdateSchema = z
  .object({
    user_id: coerceInt,
    user_name: z.string().trim().min(1, 'user_name is required').max(150),
    submission_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'submission_date must be YYYY-MM-DD')
      .optional(),
    blockers_status: z.enum(BLOCKERS_STATUS).optional().default('no_blockers'),
    blockers_description: z.string().trim().max(5000).optional().nullable(),
    work_done: z.string().trim().min(1, 'work_done is required').max(10000),
    next_day_plan: z.string().trim().max(10000).optional().nullable(),
  })
  .superRefine((val, ctx) => {
    if (val.blockers_status === 'has_blockers' && !val.blockers_description?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['blockers_description'],
        message: 'blockers_description is required when blockers_status is "has_blockers"',
      })
    }
  })

export type CreateDailyUpdateInput = z.infer<typeof createDailyUpdateSchema>

export const ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024 // 10 MB
export const ATTACHMENT_ALLOWED_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
  'text/plain',
  'text/csv',
] as const

export function validateAttachmentFile(file: File): void {
  if (file.size === 0) {
    throw Object.assign(new Error('attachment file is empty'), { code: 'VALIDATION' })
  }
  if (file.size > ATTACHMENT_MAX_BYTES) {
    throw Object.assign(new Error(`attachment exceeds ${ATTACHMENT_MAX_BYTES} bytes`), {
      code: 'PAYLOAD_TOO_LARGE',
    })
  }
  if (!ATTACHMENT_ALLOWED_MIME.includes(file.type as (typeof ATTACHMENT_ALLOWED_MIME)[number])) {
    throw Object.assign(
      new Error(
        `unsupported attachment type: ${file.type || 'unknown'}. Allowed: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, TXT, CSV`
      ),
      { code: 'UNSUPPORTED_MEDIA_TYPE' }
    )
  }
}
