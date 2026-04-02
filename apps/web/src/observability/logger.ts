// Structured logging helper (Faz O — O.1.2)
// Sentry ile entegre, console fallback

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp?: string;
}

function createLogEntry(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
): LogEntry {
  return {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  };
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => {
    const entry = createLogEntry('debug', message, context);
    if (import.meta.env.DEV) console.debug(`[${entry.level}]`, entry.message, entry.context ?? '');
  },
  info: (message: string, context?: Record<string, unknown>) => {
    const entry = createLogEntry('info', message, context);
    console.info(`[${entry.level}]`, entry.message, entry.context ?? '');
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    const entry = createLogEntry('warn', message, context);
    console.warn(`[${entry.level}]`, entry.message, entry.context ?? '');
  },
  error: (message: string, context?: Record<string, unknown>) => {
    const entry = createLogEntry('error', message, context);
    console.error(`[${entry.level}]`, entry.message, entry.context ?? '');
  },
};
