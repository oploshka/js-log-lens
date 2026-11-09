import type { sLogStructure, tLogLevel, tLogListener } from '../Type/Log';

/** Переиспользованные стили из исходного logger.zip; все стили можно заменить. */
export const CONSOLE_LEVEL_STYLES: Record<tLogLevel, { icon: string; label: string; css: string }> = {
  emergency: { icon: '☢️', label: 'EMERGENCY', css: 'background: #e74c3c; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 3px;' },
  alert: { icon: '⚠️', label: 'ALERT', css: 'background: #d35400; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 3px;' },
  critical: { icon: '💥', label: 'CRITICAL', css: 'background: #c0392b; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 3px;' },
  error: { icon: '❌', label: 'ERROR', css: 'background: #e74c3c; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 3px;' },
  warning: { icon: '🟧', label: 'WARNING', css: 'color: #f39c12; font-weight: bold; background: #fff9ea; padding: 1px 5px; border-radius: 3px;' },
  notice: { icon: '🔷', label: 'NOTICE', css: 'color: #2980b9; font-weight: bold; background: #ebf5fb; padding: 1px 5px; border-radius: 3px;' },
  info: { icon: '🟩', label: 'INFO', css: 'color: #2ece71; font-weight: bold; background: #eef9f2; padding: 1px 5px; border-radius: 3px;' },
  debug: { icon: '⚙️', label: 'DEBUG', css: 'color: #7f8c8d; font-weight: bold;' },
};

export interface sConsoleListenerOptions {
  console?: Pick<Console, 'log'>;
  styles?: Partial<typeof CONSOLE_LEVEL_STYLES>;
  includeMeta?: boolean;
}

/** Не меняет исходные аргументы; вывод метаданных настраивается отдельно. */
export function createConsoleListener(options: sConsoleListenerOptions = {}): tLogListener {
  const target = options.console ?? console;
  const styles = { ...CONSOLE_LEVEL_STYLES, ...options.styles };

  return (entry: sLogStructure): void => {
    const style = styles[entry.logInfo.level];
    const additional = options.includeMeta ? [entry.meta] : [];
    target.log(`%c${style.icon} ${style.label}`, style.css, ...entry.args, ...additional);
  };
}
