// Mobile structured logging (ADR-009)
// Web'deki logger.ts pattern'i ile uyumlu, React Native __DEV__ flag kullanir

// React Native runtime'da global olarak tanimli olan __DEV__ degiskeni
declare const __DEV__: boolean;

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

/** Structured log girisini olusturur */
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

/** Log girisini formatlar ve konsola yazar */
function writeLog(entry: LogEntry): void {
  const prefix = `[${entry.level.toUpperCase()}] ${entry.timestamp}`;

  switch (entry.level) {
    case 'debug':
      // Debug sadece development ortaminda yazilir
      if (__DEV__) {
        console.debug(prefix, entry.message, entry.context ?? '');
      }
      break;
    case 'info':
      console.info(prefix, entry.message, entry.context ?? '');
      break;
    case 'warn':
      console.warn(prefix, entry.message, entry.context ?? '');
      break;
    case 'error':
      console.error(prefix, entry.message, entry.context ?? '');
      break;
  }
}

export const logger = {
  /** Debug seviyesi — sadece __DEV__ modunda konsola yazilir */
  debug: (message: string, context?: Record<string, unknown>): void => {
    writeLog(createLogEntry('debug', message, context));
  },

  /** Info seviyesi — genel bilgilendirme loglari */
  info: (message: string, context?: Record<string, unknown>): void => {
    writeLog(createLogEntry('info', message, context));
  },

  /** Warn seviyesi — dikkat edilmesi gereken durumlar */
  warn: (message: string, context?: Record<string, unknown>): void => {
    writeLog(createLogEntry('warn', message, context));
  },

  /** Error seviyesi — hata loglari */
  error: (message: string, context?: Record<string, unknown>): void => {
    writeLog(createLogEntry('error', message, context));
  },
};
