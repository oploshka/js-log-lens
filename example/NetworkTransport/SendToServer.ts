import { LogLevel } from '../../src/Type/Log';
import { NetworkModule } from '../../src/Module/Network';
import type { sLogStructure } from '../../src/Type/Log';

export interface sNetworkPayload {
  level: LogLevel;
  timestamp: number;
  meta: Record<string, unknown>;
  args: unknown[];
}

/** Consumer-owned serialization; adapt Error objects before JSON.stringify. */
export function toNetworkPayload(entry: sLogStructure): sNetworkPayload {
  return {
    level: entry.logInfo.level,
    timestamp: entry.logInfo.timestamp,
    meta: entry.meta,
    args: entry.args.map((value) => value instanceof Error
      ? { name: value.name, message: value.message, stack: value.stack }
      : value),
  };
}

export function createServerLogModule(
  request: (payload: sNetworkPayload) => PromiseLike<void> | void,
): NetworkModule<sNetworkPayload> {
  return new NetworkModule<sNetworkPayload>({
    dependencies: {
      transform: toNetworkPayload,
      request: request,
    },
  });
}
