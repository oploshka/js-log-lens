export { LogLevel } from './Type/Log';
export type {
  sLogInfo,
  sLogStructure,
  sLogOptions,
  sLogOrigin,
  tLogArgs,
  tLogListener,
  tLogMeta,
  tLogMethods,
  tTimestampProvider,
} from './Type/Log';
export { LogEvent } from './LogEvent';
export { Log } from './Log';
export { LogAdapter } from './LogAdapter';
export type { sLogAdapterOptions } from './LogAdapter';
export { LogLens } from './LogLens';
export { LogLensModule } from './LogLensModule';
export type { iLogLensModule, sLogLensModuleOptions } from './LogLensModule';
export { LogLensModuleManager } from './LogLensModuleManager';
export { ConsoleModule, CONSOLE_LEVEL_STYLES } from './Module/Console';
export type { sConsoleLevelStyle, sConsoleModuleSettings, sConsoleModuleDependencies } from './Module/Console';

import { LogLens } from './LogLens';
import { ConsoleModule } from './Module/Console';

export const defaultLens = new LogLens().use('console', new ConsoleModule());
export const LOG = defaultLens.build();
export default LOG;
