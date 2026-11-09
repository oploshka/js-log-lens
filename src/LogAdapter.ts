import { Log } from './Log';
import { LogLevel } from './Type/Log';
import type { sLogOrigin, tLogArgs, tLogMeta, tLogMethods } from './Type/Log';

export interface sLogAdapterOptions {
  log?: Log;
  parentLog?: LogAdapterCore;
  name?: string;
  meta?: tLogMeta;
}

/** One set of level wrappers shared by the full adapter and one-shot meta(). */
function createLogMethods(log: Log, meta: tLogMeta, logger: sLogOrigin): tLogMethods {
  const methods = {} as tLogMethods;
  for (const level of Object.values(LogLevel)) {
    methods[level] = (...args: tLogArgs): void => {
      log[level]({
        args: args,
        meta: meta,
        logger: logger,
      });
    };
  }
  return methods;
}

/**
 * Dynamic methods are installed by the constructor.
 * Keeping the implementation separate avoids unsafe class/interface declaration merging.
 */
class LogAdapterCore {
  readonly name?: string;
  readonly parentLog?: LogAdapterCore;
  readonly origin: sLogOrigin;
  private readonly log: Log;
  private readonly _meta: tLogMeta;

  constructor(options: sLogAdapterOptions) {
    const log = options.log ?? options.parentLog?.log;
    if (!log) {
      throw new Error('LogAdapter requires log or parentLog');
    }
    this.log = log;
    this.parentLog = options.parentLog;
    this.name = options.name;
    this._meta = {
      ...options.parentLog?._meta,
      ...options.meta,
    };
    this.origin = Object.freeze({
      name: this.name,
      parent: this.parentLog?.origin,
    });
    Object.assign(this, createLogMethods(this.log, this._meta, this.origin));
  }

  child(name: string, meta?: tLogMeta): LogAdapter;
  child(meta: tLogMeta): LogAdapter;
  child(nameOrMeta: string | tLogMeta, meta: tLogMeta = {}): LogAdapter {
    return new LogAdapter({
      parentLog: this,
      name: typeof nameOrMeta === 'string' ? nameOrMeta : undefined,
      meta: typeof nameOrMeta === 'string' ? meta : nameOrMeta,
    });
  }

  /** Context for a single log call; no child() or meta() on the result. */
  meta(meta: tLogMeta): tLogMethods {
    return createLogMethods(this.log, {
      ...this._meta,
      ...meta,
    }, this.origin);
  }
}

/** The public instance combines the adapter API and the generated severity methods. */
export type LogAdapter = LogAdapterCore & tLogMethods;

/** Runtime constructor with a typed instance shape. */
export const LogAdapter = LogAdapterCore as new (options: sLogAdapterOptions) => LogAdapter;
