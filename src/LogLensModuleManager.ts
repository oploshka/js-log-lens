import { LogEvent } from './LogEvent';
import { LogLensModule } from './LogLensModule';
import type { sLogStructure } from './Type/Log';

type tRegisteredModule = {
  module: LogLensModule<any, any>;
  enabled: boolean;
  unsubscribe: () => void;
};

/** Owns module lifecycle, registrations, and subscriptions. */
export class LogLensModuleManager {
  private readonly registry = new Map<string, tRegisteredModule>();
  private disposed = false;

  constructor(private readonly event: LogEvent) {}

  add(name: string, module: LogLensModule<any, any>): this {
    if (this.disposed) throw new Error('Module manager has been disposed');
    if (this.registry.has(name)) throw new Error(`Module already registered: ${name}`);
    module.install();
    const state: tRegisteredModule = {
      module: module,
      enabled: true,
      unsubscribe: () => {},
    };
    const listener = (entry: sLogStructure): void => {
      if (state.enabled && module.filter(entry)) module.run(entry);
    };
    state.unsubscribe = this.event.subscribe(listener);
    this.registry.set(name, state);
    return this;
  }

  remove(name: string): boolean {
    const state = this.registry.get(name);
    if (!state) return false;
    state.unsubscribe();
    this.registry.delete(name);
    state.module.uninstall();
    return true;
  }

  enable(name: string): void {
    this.getRequired(name).enabled = true;
  }

  disable(name: string): void {
    this.getRequired(name).enabled = false;
  }

  isEnabled(name: string): boolean {
    return this.getRequired(name).enabled;
  }

  get(name: string): LogLensModule<any, any> | undefined {
    return this.registry.get(name)?.module;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    for (const name of [...this.registry.keys()].reverse()) this.remove(name);
  }

  private getRequired(name: string): tRegisteredModule {
    const state = this.registry.get(name);
    if (!state) throw new Error(`Unknown module: ${name}`);
    return state;
  }
}
