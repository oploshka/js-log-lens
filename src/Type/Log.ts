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

export interface sLogInfo {
  level: LogLevel;
  timestamp: number;
}

export interface sLogStructure {
  logInfo: sLogInfo;
  args: tLogArgs;
  meta: tLogMeta;
}

export type tLogListener = (entry: sLogStructure) => void;
export type tTimestampProvider = () => number;
