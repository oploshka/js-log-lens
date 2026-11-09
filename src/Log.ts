import { LogEvent } from './LogEvent';
import { LogLevel } from './Type/Log';
import type { sLogStructure, tLogArgs, tTimestampProvider } from './Type/Log';

/** PSR-3 severity names. Contextual meta is deliberately left for a future API. */
export class Log {
  constructor(
    private readonly event: LogEvent,
    private readonly now: tTimestampProvider = Date.now,
  ) {}

  private emit(level: LogLevel, args: tLogArgs): void {
    const entry: sLogStructure = {
      logInfo: {
        level: level,
        timestamp: this.now(),
      },
      args: args,
      meta: {},
    };
    this.event.emitLog(entry);
  }

  emergency(...args: tLogArgs): void { this.emit(LogLevel.Emergency, args); }
  alert(...args: tLogArgs): void { this.emit(LogLevel.Alert, args); }
  critical(...args: tLogArgs): void { this.emit(LogLevel.Critical, args); }
  error(...args: tLogArgs): void { this.emit(LogLevel.Error, args); }
  warning(...args: tLogArgs): void { this.emit(LogLevel.Warning, args); }
  notice(...args: tLogArgs): void { this.emit(LogLevel.Notice, args); }
  info(...args: tLogArgs): void { this.emit(LogLevel.Info, args); }
  debug(...args: tLogArgs): void { this.emit(LogLevel.Debug, args); }
}
