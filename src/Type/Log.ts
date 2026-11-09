export const LOG_LEVELS = [
  'emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug',
] as const;

export type tLogLevel = typeof LOG_LEVELS[number];
export type tLogArgs = unknown[];
export type tLogMeta = Record<string, unknown>;
export type tTimestampProvider = () => number;

export interface sLogInfo {
  level: tLogLevel;
  timestamp: number;
}

export interface sLogStructure {
  logInfo: sLogInfo;
  args: tLogArgs;
  meta: tLogMeta;
}

export type tLogListener = (entry: sLogStructure) => void;

export interface iLogEvent {
  emitLog(entry: sLogStructure): void;
  subscribe(listener: tLogListener): () => void;
  unsubscribe(listener: tLogListener): void;
}

export type iLogger = Readonly<Record<tLogLevel, (...args: tLogArgs) => void>>;
