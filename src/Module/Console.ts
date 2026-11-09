import { LogLevel } from '../Type/Log';
import type { iLogModule, sLogStructure, tLogListener } from '../Type/Log';
import type { LogEvent } from '../LogEvent';

export interface sConsoleLevelStyle {
  icon: string;
  label: string;
  css: string;
}

/** Console settings migrated from the original logger.zip. */
export const CONSOLE_LEVEL_STYLES: Record<LogLevel, sConsoleLevelStyle> = {
  [LogLevel.Emergency]: { icon: '☢️', label: 'EMERGENCY', css: 'background: #e74c3c; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 3px;' },
  [LogLevel.Alert]: { icon: '⚠️', label: 'ALERT', css: 'background: #d35400; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 3px;' },
  [LogLevel.Critical]: { icon: '💥', label: 'CRITICAL', css: 'background: #c0392b; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 3px;' },
  [LogLevel.Error]: { icon: '❌', label: 'ERROR', css: 'background: #e74c3c; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 3px;' },
  [LogLevel.Warning]: { icon: '🟧', label: 'WARNING', css: 'color: #f39c12; font-weight: bold; background: #fff9ea; padding: 1px 5px; border-radius: 3px;' },
  [LogLevel.Notice]: { icon: '🔷', label: 'NOTICE', css: 'color: #2980b9; font-weight: bold; background: #ebf5fb; padding: 1px 5px; border-radius: 3px;' },
  [LogLevel.Info]: { icon: '🟩', label: 'INFO', css: 'color: #2ece71; font-weight: bold; background: #eef9f2; padding: 1px 5px; border-radius: 3px;' },
  [LogLevel.Debug]: { icon: '⚙️', label: 'DEBUG', css: 'color: #7f8c8d; font-weight: bold;' },
};

export interface sConsoleModuleOptions {
  console?: Pick<Console, 'log'>;
  styles?: Partial<Record<LogLevel, sConsoleLevelStyle>>;
  includeMeta?: boolean;
}

/** Console is one replaceable module, not a responsibility of Log. */
export class ConsoleModule implements iLogModule {
  constructor(private readonly options: sConsoleModuleOptions = {}) {}

  install(event: LogEvent): () => void {
    const target = this.options.console ?? console;
    const styles = { ...CONSOLE_LEVEL_STYLES, ...this.options.styles };
    const listener: tLogListener = (entry: sLogStructure): void => {
      const style = styles[entry.logInfo.level];
      const additional = this.options.includeMeta ? [entry.meta] : [];
      target.log(`%c${style.icon} ${style.label}`, style.css, ...entry.args, ...additional);
    };
    return event.subscribe(listener);
  }
}
