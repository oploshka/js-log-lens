import { LogLensModule } from '@loglens/LogLensModule';
import type { sLogStructure } from '@loglens/Type/Log';

export interface sPageLogModuleSettings {
  maxEntries: number;
}

export interface sPageLogModuleDependencies {
  onEntriesChange: (entries: readonly sLogStructure[]) => void;
}

/** Test-only in-memory module, entirely independent from Vue. */
export class PageLogModule extends LogLensModule<
  sPageLogModuleSettings,
  sPageLogModuleDependencies
> {
  private entries: sLogStructure[] = [];

  static override getDefaultSettings(): sPageLogModuleSettings {
    return { maxEntries: 100 };
  }

  override run(entry: sLogStructure): void {
    this.entries.push(entry);
    const excess = this.entries.length - this.settings.maxEntries;
    if (excess > 0) this.entries.splice(0, excess);
    this.publish();
  }

  clear(): void {
    this.entries = [];
    this.publish();
  }

  private publish(): void {
    this.dependencies.onEntriesChange?.([...this.entries]);
  }
}
