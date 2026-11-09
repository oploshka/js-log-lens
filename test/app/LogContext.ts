import type { InjectionKey, ShallowRef } from 'vue';
import type { LogAdapter, LogLens, sLogStructure } from 'js-log-lens';
import type { PageLogModule } from '@app/Module/PageLog';

/** Dependencies configured once during application bootstrap. */
export interface sAppLogContext {
  lens: LogLens;
  log: LogAdapter;
  entries: Readonly<ShallowRef<readonly sLogStructure[]>>;
  pageModule: PageLogModule;
}

export const AppLogKey: InjectionKey<sAppLogContext> = Symbol('AppLog');
