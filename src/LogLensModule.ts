import type { sLogStructure } from './Type/Log';

export interface sLogLensModuleOptions<TSettings extends object, TDependencies extends object> {
  dependencies?: Partial<TDependencies>;
  settings?: Partial<TSettings>;
}

/** Non-generic lifecycle contract used by the module manager. */
export interface iLogLensModule {
  install(): void;
  uninstall(): void;
  filter(entry: sLogStructure): boolean;
  run(entry: sLogStructure): void;
}

/** A module handles entries; subscriptions and enablement belong to the manager. */
export abstract class LogLensModule<
  TSettings extends object = Record<string, never>,
  TDependencies extends object = Record<string, never>,
> implements iLogLensModule {
  protected dependencies: Partial<TDependencies>;
  protected settings: TSettings;

  static getDefaultSettings(): object {
    return {};
  }

  constructor(options: sLogLensModuleOptions<TSettings, TDependencies> = {}) {
    this.dependencies = { ...options.dependencies };
    const constructor = this.constructor as typeof LogLensModule;
    this.settings = {
      ...constructor.getDefaultSettings(),
      ...options.settings,
    } as TSettings;
  }

  install(): void {}
  uninstall(): void {}
  filter(_entry: sLogStructure): boolean { return true; }
  abstract run(entry: sLogStructure): void;

  setSettings(settings: TSettings): void {
    this.settings = { ...settings };
  }

  mergeSettings(settings: Partial<TSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }

  getSettings(): Readonly<TSettings> {
    return { ...this.settings };
  }
}
