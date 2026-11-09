import { LogLevel } from '../Type/Log';
import type { sLogStructure } from '../Type/Log';
import { LogLensModule } from '../LogLensModule';

export interface sConsoleLevelStyle {
  icon: string;
  label: string;
  css: string;
}

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

export interface sConsoleModuleSettings {
  styles: Partial<Record<LogLevel, sConsoleLevelStyle>>;
  includeMeta: boolean;
}

export interface sConsoleModuleDependencies {
  console: Pick<Console, 'log'>;
}

/** Console output is a module; manager performs the subscription. */
export class ConsoleModule extends LogLensModule<sConsoleModuleSettings, sConsoleModuleDependencies> {
  static override getDefaultSettings(): sConsoleModuleSettings {
    return {
      styles: {},
      includeMeta: false,
    };
  }

  override run(entry: sLogStructure): void {
    const target = this.dependencies.console ?? console;
    const style = this.settings.styles[entry.logInfo.level] ?? CONSOLE_LEVEL_STYLES[entry.logInfo.level];
    const metaArgs = this.settings.includeMeta ? [entry.meta] : [];
    target.log(`%c${style.icon} ${style.label}`, style.css, ...entry.args, ...metaArgs);
  }
}
