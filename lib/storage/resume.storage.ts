import 'server-only'
import { getAdminSupabase, TEAM_BUCKET, RESUME_FOLDER } from '@/lib/supabase/admin'
import { StorageError } from '@/lib/api/errors'
import { logger } from '@/lib/logger'

const log = logger.child('resume.storage')

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'member'
  )
}

function extractExt(filename: string, fallback = 'pdf'): string {
  const match = filename.match(/\.([a-zA-Z0-9]+)$/)
  return match ? match[1].toLowerCase() : fallback
}

export interface UploadedResume {
  path: string
  bucket: string
  size: number
  mime: string
}

export async function uploadResume(params: {
  file: File
  ownerSlugSeed: string
}): Promise<UploadedResume> {
  const { file, ownerSlugSeed } = params
  const supabase = getAdminSupabase()

  const ext = extractExt(file.name)
  const objectPath = `${RESUME_FOLDER}/${slugify(ownerSlugSeed)}-${Date.now()}.${ext}`

  const bytes = await file.arrayBuffer()

  const { error } = await supabase.storage.from(TEAM_BUCKET).upload(objectPath, bytes, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  })

  if (error) {
    log.error('resume upload failed', { path: objectPath, message: error.message })
    throw new StorageError(`Resume upload failed: ${error.message}`)
  }

  log.info('resume uploaded', { path: objectPath, size: file.size })

  return {
    path: objectPath,
    bucket: TEAM_BUCKET,
    size: file.size,
    mime: file.type || 'application/octet-stream',
  }
}

export async function removeResume(path: string): Promise<void> {
  const supabase = getAdminSupabase()
  const { error } = await supabase.storage.from(TEAM_BUCKET).remove([path])
  if (error) {
    log.warn('resume remove failed (ignored)', { path, message: error.message })
  }
}
