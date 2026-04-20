import 'server-only'
import {
  CreateDailyUpdateInput,
  validateAttachmentFile,
} from '@/lib/validation/daily-update.schema'
import {
  insertDailyUpdate,
  listDailyUpdatesBySubmissionDate,
} from '@/lib/repositories/daily-update.repository'
import {
  removeDailyUpdateAttachment,
  uploadDailyUpdateAttachment,
} from '@/lib/storage/daily-update.storage'
import { logger } from '@/lib/logger'
import {
  AppError,
  PayloadTooLargeError,
  UnsupportedMediaTypeError,
  ValidationError,
} from '@/lib/api/errors'
import type { DailyUpdate } from '@/lib/types'

const log = logger.child('daily-update.service')

export interface CreateDailyUpdateParams {
  input: CreateDailyUpdateInput
  attachment: File | null
}

function todayIso(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export async function createDailyUpdate(
  params: CreateDailyUpdateParams
): Promise<DailyUpdate> {
  const { input, attachment } = params

  if (attachment) {
    try {
      validateAttachmentFile(attachment)
    } catch (err) {
      const e = err as Error & { code?: string }
      if (e.code === 'PAYLOAD_TOO_LARGE') throw new PayloadTooLargeError(e.message)
      if (e.code === 'UNSUPPORTED_MEDIA_TYPE') throw new UnsupportedMediaTypeError(e.message)
      throw new ValidationError(e.message)
    }
  }

  let uploadedPath: string | null = null

  try {
    let attachmentMeta: {
      path: string
      originalName: string
      mime: string
      size: number
    } | null = null

    if (attachment) {
      const uploaded = await uploadDailyUpdateAttachment({
        file: attachment,
        ownerSlugSeed: input.user_name,
      })
      uploadedPath = uploaded.path
      attachmentMeta = {
        path: uploaded.path,
        originalName: uploaded.originalName,
        mime: uploaded.mime,
        size: uploaded.size,
      }
    }

    const record = await insertDailyUpdate({
      user_id: input.user_id,
      user_name: input.user_name,
      submission_date: input.submission_date ?? todayIso(),
      blockers_status: input.blockers_status ?? 'no_blockers',
      blockers_description: input.blockers_description ?? null,
      work_done: input.work_done,
      next_day_plan: input.next_day_plan ?? null,
      attachment_path: attachmentMeta?.path ?? null,
      attachment_original_name: attachmentMeta?.originalName ?? null,
      attachment_mime_type: attachmentMeta?.mime ?? null,
      attachment_size: attachmentMeta?.size ?? null,
    })

    log.info('daily update created', { id: record.id, user_id: record.user_id })
    return record
  } catch (err) {
    if (uploadedPath) {
      log.warn('rolling back storage object after failure', { path: uploadedPath })
      await removeDailyUpdateAttachment(uploadedPath)
    }
    if (err instanceof AppError) throw err
    throw err
  }
}

export async function getTodayDailyUpdates(): Promise<DailyUpdate[]> {
  const date = todayIso()
  const records = await listDailyUpdatesBySubmissionDate(date)
  log.info('today daily updates listed', { date, count: records.length })
  return records
}
