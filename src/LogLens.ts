import { Log } from './Log';
import { LogEvent } from './LogEvent';
import type { iLogLensModule } from './LogLensModule';
import { LogLensModuleManager } from './LogLensModuleManager';
import type { tTimestampProvider } from './Type/Log';

/** Combines one event bus, its module manager, and the logger. */
export class LogLens {
  readonly event: LogEvent;
  readonly modules: LogLensModuleManager;
  private readonly logger: Log;
  private disposed = false;

  constructor(event: LogEvent = new LogEvent(), now: tTimestampProvider = Date.now) {
    this.event = event;
    this.modules = new LogLensModuleManager(event);
    this.logger = new Log(event, now);
  }

  use(name: string, module: iLogLensModule): this {
    this.modules.add(name, module);
    return this;
  }

  build(): Log {
    if (this.disposed) throw new Error('LogLens has been disposed');
    return this.logger;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.modules.dispose();
  }
}
