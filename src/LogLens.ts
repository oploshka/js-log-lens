import { Log } from './Log';
import { LogEvent } from './LogEvent';
import type { iLogModule, tTimestampProvider } from './Type/Log';

/** Assembles one LogEvent, zero or more modules, and a Log instance. */
export class LogLens {
  readonly event: LogEvent;
  private readonly modules: iLogModule[] = [];
  private readonly disposers: Array<() => void> = [];
  private logger?: Log;
  private disposed = false;

  constructor(
    event: LogEvent = new LogEvent(),
    private readonly now: tTimestampProvider = Date.now,
  ) {
    this.event = event;
  }

  use(module: iLogModule): this {
    if (this.logger || this.disposed) {
      throw new Error('Modules must be registered before build()');
    }
    this.modules.push(module);
    return this;
  }

  build(): Log {
    if (this.disposed) {
      throw new Error('LogLens has been disposed');
    }
    if (this.logger) return this.logger;

    for (const module of this.modules) {
      const dispose = module.install(this.event);
      if (dispose) this.disposers.push(dispose);
    }

    this.logger = new Log(this.event, this.now);
    return this.logger;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    for (const dispose of this.disposers.reverse()) dispose();
    this.disposers.length = 0;
  }
}
