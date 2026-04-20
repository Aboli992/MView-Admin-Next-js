import 'server-only'
import { getAdminSupabase, TEAM_BUCKET } from '@/lib/supabase/admin'
import { StorageError } from '@/lib/api/errors'
import { logger } from '@/lib/logger'

const log = logger.child('daily-update.storage')

const DAILY_UPDATE_FOLDER = 'dailytask_attachfile'

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'user'
  )
}

function extractExt(filename: string, fallback = 'bin'): string {
  const match = filename.match(/\.([a-zA-Z0-9]+)$/)
  return match ? match[1].toLowerCase() : fallback
}

export interface UploadedAttachment {
  path: string
  publicUrl: string
  bucket: string
  size: number
  mime: string
  originalName: string
}

export async function uploadDailyUpdateAttachment(params: {
  file: File
  ownerSlugSeed: string
}): Promise<UploadedAttachment> {
  const { file, ownerSlugSeed } = params
  const supabase = getAdminSupabase()

  const ext = extractExt(file.name)
  const objectPath = `${DAILY_UPDATE_FOLDER}/${slugify(ownerSlugSeed)}-${Date.now()}.${ext}`

  const bytes = await file.arrayBuffer()

  const { error } = await supabase.storage.from(TEAM_BUCKET).upload(objectPath, bytes, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  })

  if (error) {
    log.error('attachment upload failed', { path: objectPath, message: error.message })
    throw new StorageError(`Attachment upload failed: ${error.message}`)
  }

  const { data: publicUrlData } = supabase.storage
    .from(TEAM_BUCKET)
    .getPublicUrl(objectPath)

  log.info('attachment uploaded', { path: objectPath, size: file.size })

  return {
    path: objectPath,
    publicUrl: publicUrlData.publicUrl,
    bucket: TEAM_BUCKET,
    size: file.size,
    mime: file.type || 'application/octet-stream',
    originalName: file.name,
  }
}

export async function removeDailyUpdateAttachment(path: string): Promise<void> {
  const supabase = getAdminSupabase()
  const { error } = await supabase.storage.from(TEAM_BUCKET).remove([path])
  if (error) {
    log.warn('attachment remove failed (ignored)', { path, message: error.message })
  }
}
