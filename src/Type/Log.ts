export enum LogLevel {
  Emergency = 'emergency',
  Alert = 'alert',
  Critical = 'critical',
  Error = 'error',
  Warning = 'warning',
  Notice = 'notice',
  Info = 'info',
  Debug = 'debug',
}

export type tLogArgs = unknown[];
export type tLogMeta = Record<string, unknown>;

/** Immutable description of the originating logger; the parent is a reference. */
export interface sLogOrigin {
  readonly name?: string;
  readonly parent?: sLogOrigin;
}

export interface sLogInfo {
  level: LogLevel;
  timestamp: number;
  logger?: sLogOrigin;
}

export interface sLogStructure {
  logInfo: sLogInfo;
  args: tLogArgs;
  meta: tLogMeta;
}

/** Explicit internal command passed to Log's severity methods. */
export interface sLogOptions {
  args: tLogArgs;
  meta: tLogMeta;
  logger?: sLogOrigin;
}

export type tLogMethods = {
  [K in LogLevel]: (...args: tLogArgs) => void;
};

export type tLogListener = (entry: sLogStructure) => void;
export type tTimestampProvider = () => number;
