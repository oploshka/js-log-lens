export { LogLevel } from './Type/Log';
export type {
  iLogModule,
  sLogInfo,
  sLogStructure,
  tLogArgs,
  tLogListener,
  tLogMeta,
  tTimestampProvider,
} from './Type/Log';
export { LogEvent } from './LogEvent';
export { Log } from './Log';
export { LogLens } from './LogLens';
export { ConsoleModule, CONSOLE_LEVEL_STYLES } from './Module/Console';
export type { sConsoleLevelStyle, sConsoleModuleOptions } from './Module/Console';

import { LogLens } from './LogLens';
import { ConsoleModule } from './Module/Console';

/** Convenience logger; consumers can assemble their own instances. */
export const defaultLens = new LogLens().use(new ConsoleModule());
export const LOG = defaultLens.build();
export default LOG;
