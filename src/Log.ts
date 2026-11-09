import { LogEvent } from './LogEvent';
import { LogLevel } from './Type/Log';
import type { sLogOptions, sLogStructure, tTimestampProvider } from './Type/Log';

/** Internal structured logger. Public variadic methods live in LogAdapter. */
export class Log {
  constructor(
    private readonly event: LogEvent,
    private readonly now: tTimestampProvider = Date.now,
  ) {}

  private emit(level: LogLevel, options: sLogOptions): void {
    const entry: sLogStructure = {
      logInfo: {
        level: level,
        timestamp: this.now(),
        logger: options.logger,
      },
      args: options.args,
      meta: { ...options.meta },
    };
    this.event.emitLog(entry);
  }

  emergency(options: sLogOptions): void { this.emit(LogLevel.Emergency, options); }
  alert(options: sLogOptions): void { this.emit(LogLevel.Alert, options); }
  critical(options: sLogOptions): void { this.emit(LogLevel.Critical, options); }
  error(options: sLogOptions): void { this.emit(LogLevel.Error, options); }
  warning(options: sLogOptions): void { this.emit(LogLevel.Warning, options); }
  notice(options: sLogOptions): void { this.emit(LogLevel.Notice, options); }
  info(options: sLogOptions): void { this.emit(LogLevel.Info, options); }
  debug(options: sLogOptions): void { this.emit(LogLevel.Debug, options); }
}
