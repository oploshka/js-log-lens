import { createLogEvent } from './createLogEvent';
import { createLogger } from './createLogger';
import { createConsoleListener } from './Listener/Console';

export { createLogEvent } from './createLogEvent';
export { createLogger } from './createLogger';
export { createConsoleListener, CONSOLE_LEVEL_STYLES } from './Listener/Console';
export { LOG_LEVELS } from './Type/Log';
export type {
  iLogEvent,
  iLogger,
  sLogInfo,
  sLogStructure,
  tLogArgs,
  tLogLevel,
  tLogListener,
  tLogMeta,
  tTimestampProvider,
} from './Type/Log';
export type { sConsoleListenerOptions } from './Listener/Console';

// Базовый логгер, совместимый с прежним способом вызова LOG.debug(...).
export const logEvent = createLogEvent();
logEvent.subscribe(createConsoleListener());
export const LOG = createLogger(logEvent);
export default LOG;
