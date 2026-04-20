import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { AppError, ErrorCode } from './errors'
import { logger } from '@/lib/logger'
import { env } from '@/lib/env'

export interface SuccessEnvelope<T> {
  success: true
  data: T
  meta?: Record<string, unknown>
}

export interface ErrorEnvelope {
  success: false
  error: {
    code: ErrorCode | 'INTERNAL_ERROR'
    message: string
    details?: unknown
    requestId?: string
  }
}

export function ok<T>(
  data: T,
  init?: { status?: number; meta?: Record<string, unknown>; headers?: HeadersInit }
): NextResponse<SuccessEnvelope<T>> {
  return NextResponse.json<SuccessEnvelope<T>>(
    { success: true, data, ...(init?.meta ? { meta: init.meta } : {}) },
    { status: init?.status ?? 200, headers: init?.headers }
  )
}

export function fail(
  status: number,
  code: ErrorCode | 'INTERNAL_ERROR',
  message: string,
  details?: unknown,
  requestId?: string
): NextResponse<ErrorEnvelope> {
  return NextResponse.json<ErrorEnvelope>(
    { success: false, error: { code, message, ...(details ? { details } : {}), ...(requestId ? { requestId } : {}) } },
    { status }
  )
}

export function handleError(err: unknown, requestId?: string): NextResponse<ErrorEnvelope> {
  if (err instanceof ZodError) {
    const details = err.issues.map((i) => ({
      path: i.path.join('.'),
      message: i.message,
      code: i.code,
    }))
    logger.warn('Validation error', { requestId, details })
    return fail(400, 'VALIDATION_ERROR', 'Validation failed', details, requestId)
  }

  if (err instanceof AppError) {
    logger.warn('Handled app error', {
      requestId,
      code: err.code,
      status: err.status,
      message: err.message,
    })
    return fail(err.status, err.code, err.message, err.details, requestId)
  }

  const message = err instanceof Error ? err.message : 'Unknown error'
  logger.error('Unhandled error', {
    requestId,
    message,
    stack: err instanceof Error ? err.stack : undefined,
  })

  const exposeMessage = env.NODE_ENV !== 'production'
  return fail(
    500,
    'INTERNAL_ERROR',
    exposeMessage ? message : 'Internal server error',
    undefined,
    requestId
  )
}

export function newRequestId(): string {
  return (globalThis.crypto?.randomUUID?.() ?? `req_${Date.now()}_${Math.random().toString(36).slice(2)}`)
}
