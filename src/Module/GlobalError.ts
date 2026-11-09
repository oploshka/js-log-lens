import { LogLensModule } from '../LogLensModule';
import { reportLogLensError } from '../ReportLogLensError';
import type { sLogStructure, tLogMethods } from '../Type/Log';

export interface sGlobalErrorModuleDependencies {
  logger: tLogMethods;
  target: Window;
}

/** Forwards browser uncaught errors and promise rejections to a logger. */
export class GlobalErrorModule extends LogLensModule<
  Record<string, never>,
  sGlobalErrorModuleDependencies
> {
  private target?: Window;

  private readonly onError = (event: ErrorEvent): void => {
    try {
      this.dependencies.logger?.error(
        `Глобальный перехват ошибки: ${event.message}`,
        event.error ?? event.message,
      );
    } catch (error) {
      reportLogLensError('Global error forwarding failed', error);
    }
  };

  private readonly onRejection = (event: PromiseRejectionEvent): void => {
    try {
      const reason: unknown = event.reason;
      const message = reason instanceof Error ? reason.message : String(reason);
      this.dependencies.logger?.error(`Неотловленный Promise rejection: ${message}`, reason);
    } catch (error) {
      reportLogLensError('Unhandled rejection forwarding failed', error);
    }
  };

  override install(): void {
    const target = this.dependencies.target ?? (typeof window !== 'undefined' ? window : undefined);
    if (!target) return;
    if (!this.dependencies.logger) {
      throw new Error('GlobalErrorModule requires a logger dependency');
    }

    target.addEventListener('error', this.onError);
    try {
      target.addEventListener('unhandledrejection', this.onRejection);
    } catch (error) {
      target.removeEventListener('error', this.onError);
      throw error;
    }
    this.target = target;
  }

  override uninstall(): void {
    const target = this.target;
    this.target = undefined;
    if (!target) return;
    try {
      target.removeEventListener('error', this.onError);
    } finally {
      target.removeEventListener('unhandledrejection', this.onRejection);
    }
  }

  /** Source module: it emits logs through the injected logger, not through run(). */
  override run(_entry: sLogStructure): void {}
}
