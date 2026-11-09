import { LOG_LEVELS } from './Type/Log';
import type { iLogEvent, iLogger, tLogLevel, tLogMeta, tTimestampProvider } from './Type/Log';

/** Создаёт логгер с контекстом и общим каналом записей. */
export function createLogger(
  logEvent: iLogEvent,
  meta: tLogMeta = {},
  now: tTimestampProvider = Date.now,
): iLogger {
  const loggerMeta = { ...meta };
  const logger = Object.create(null) as Record<tLogLevel, (...args: unknown[]) => void>;

  for (const level of LOG_LEVELS) {
    Object.defineProperty(logger, level, {
      enumerable: true,
      configurable: false,
      writable: false,
      value: (...args: unknown[]): void => {
        logEvent.emitLog({
          logInfo: {
            level: level,
            timestamp: now(),
          },
          args: args,
          meta: { ...loggerMeta },
        });
      },
    });
  }

  return Object.freeze(logger);
}
