import { LogEvent } from './LogEvent';
import type { iLogLensModule } from './LogLensModule';
import type { sLogStructure } from './Type/Log';
import { reportLogLensError } from './reportLogLensError';

type tRegisteredModule = {
  module: iLogLensModule;
  enabled: boolean;
  unsubscribe: () => void;
};

/** Owns subscriptions, lifecycle, and routing through module filters. */
export class LogLensModuleManager {
  private readonly registry = new Map<string, tRegisteredModule>();
  private disposed = false;

  constructor(private readonly event: LogEvent) {}

  add(name: string, module: iLogLensModule): this {
    if (this.disposed) {
      reportLogLensError('Cannot add module: manager is disposed');
      return this;
    }
    if (this.registry.has(name)) {
      reportLogLensError(`Module already registered: ${name}`);
      return this;
    }
    if ([...this.registry.values()].some((state) => state.module === module)) {
      reportLogLensError(`Module instance already registered: ${name}`);
      return this;
    }

    try {
      module.install();
    } catch (error) {
      reportLogLensError(`Module install failed: ${name}`, error);
      return this;
    }

    const state: tRegisteredModule = {
      module: module,
      enabled: true,
      unsubscribe: () => {},
    };
    const listener = (entry: sLogStructure): void => {
      if (!state.enabled) return;
      try {
        if (module.filter(entry)) module.run(entry);
      } catch (error) {
        reportLogLensError(`Module processing failed: ${name}`, error);
      }
    };

    try {
      state.unsubscribe = this.event.subscribe(listener);
      this.registry.set(name, state);
    } catch (error) {
      reportLogLensError(`Module subscription failed: ${name}`, error);
      try {
        state.unsubscribe();
        module.uninstall();
      } catch (cleanupError) {
        reportLogLensError(`Module cleanup failed: ${name}`, cleanupError);
      }
    }
    return this;
  }

  remove(name: string): boolean {
    const state = this.registry.get(name);
    if (!state) return false;
    this.registry.delete(name);
    try {
      state.unsubscribe();
    } catch (error) {
      reportLogLensError(`Module unsubscribe failed: ${name}`, error);
    }
    try {
      state.module.uninstall();
    } catch (error) {
      reportLogLensError(`Module uninstall failed: ${name}`, error);
    }
    return true;
  }

  enable(name: string): void {
    const state = this.getRequired(name);
    if (state) state.enabled = true;
  }

  disable(name: string): void {
    const state = this.getRequired(name);
    if (state) state.enabled = false;
  }

  isEnabled(name: string): boolean {
    return this.getRequired(name)?.enabled ?? false;
  }

  get(name: string): iLogLensModule | undefined {
    return this.registry.get(name)?.module;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    for (const name of [...this.registry.keys()].reverse()) this.remove(name);
  }

  private getRequired(name: string): tRegisteredModule | undefined {
    const state = this.registry.get(name);
    if (!state) reportLogLensError(`Unknown module: ${name}`);
    return state;
  }
}
