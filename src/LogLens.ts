import { Log } from './Log';
import { LogAdapter } from './LogAdapter';
import { LogEvent } from './LogEvent';
import type { iLogLensModule } from './LogLensModule';
import { LogLensModuleManager } from './LogLensModuleManager';
import { reportLogLensError } from './reportLogLensError';
import type { tTimestampProvider } from './Type/Log';

/** Combines one event bus, its module manager, and a public log adapter. */
export class LogLens {
  readonly event: LogEvent;
  readonly modules: LogLensModuleManager;
  private readonly logger: LogAdapter;
  private disposed = false;

  constructor(event: LogEvent = new LogEvent(), now: tTimestampProvider = Date.now) {
    this.event = event;
    this.modules = new LogLensModuleManager(event);
    this.logger = new LogAdapter({ log: new Log(event, now) });
  }

  use(name: string, module: iLogLensModule): this {
    this.modules.add(name, module);
    return this;
  }

  build(): LogAdapter {
    // TODO: agree what should happen when build() is called after dispose().
    if (this.disposed) reportLogLensError('Building logger after dispose()');
    return this.logger;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.modules.dispose();
  }
}
