import { LogLensModule } from '../LogLensModule';
import { reportLogLensError } from '../ReportLogLensError';
import type { sLogStructure } from '../Type/Log';

export interface sNetworkModuleDependencies<TPayload> {
  transform: (entry: sLogStructure) => TPayload;
  request: (payload: TPayload) => void | PromiseLike<void>;
  onError?: (error: unknown) => void;
}

/**
 * Converts a log entry and passes it to a consumer-supplied request callback.
 * Never awaits delivery or mutates the original entry.
 */
export class NetworkModule<TPayload = unknown> extends LogLensModule<
  Record<string, never>,
  sNetworkModuleDependencies<TPayload>
> {
  override run(entry: sLogStructure): void {
    try {
      const { transform, request } = this.dependencies;
      if (!transform || !request) {
        throw new Error('NetworkModule requires transform and request dependencies');
      }
      const payload = transform(entry);
      void Promise.resolve(request(payload)).catch((error: unknown) => this.reportError(error));
    } catch (error) {
      this.reportError(error);
    }
  }

  private reportError(error: unknown): void {
    try {
      if (this.dependencies.onError) {
        this.dependencies.onError(error);
      } else {
        reportLogLensError('Network module delivery failed', error);
      }
    } catch (reportingError) {
      reportLogLensError('Network module error handler failed', reportingError);
    }
  }
}
