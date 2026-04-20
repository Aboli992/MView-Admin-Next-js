import { env } from './env'

type Level = 'debug' | 'info' | 'warn' | 'error'

const LEVEL_WEIGHT: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 }

type Meta = Record<string, unknown>

function shouldLog(level: Level): boolean {
  return LEVEL_WEIGHT[level] >= LEVEL_WEIGHT[env.LOG_LEVEL]
}

function emit(level: Level, message: string, meta?: Meta): void {
  if (!shouldLog(level)) return
  const entry = {
    level,
    time: new Date().toISOString(),
    message,
    ...(meta ?? {}),
  }
  const line = JSON.stringify(entry)
  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.log(line)
}

export const logger = {
  debug: (m: string, meta?: Meta) => emit('debug', m, meta),
  info: (m: string, meta?: Meta) => emit('info', m, meta),
  warn: (m: string, meta?: Meta) => emit('warn', m, meta),
  error: (m: string, meta?: Meta) => emit('error', m, meta),
  child(scope: string) {
    return {
      debug: (m: string, meta?: Meta) => emit('debug', m, { scope, ...meta }),
      info: (m: string, meta?: Meta) => emit('info', m, { scope, ...meta }),
      warn: (m: string, meta?: Meta) => emit('warn', m, { scope, ...meta }),
      error: (m: string, meta?: Meta) => emit('error', m, { scope, ...meta }),
    }
  },
}
