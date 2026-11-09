import type { sLogStructure } from '../../src/Type/Log';

export interface sNetworkTransportOptions {
  url: string;
  fetchImpl?: typeof fetch;
  onError?: (error: unknown) => void;
}

/** Пример пользовательского HTTP-слушателя, без жёсткой привязки к серверу. */
export function createNetworkListener(options: sNetworkTransportOptions) {
  const fetchImpl = options.fetchImpl ?? fetch;

  return (entry: sLogStructure): void => {
    const payload = {
      logInfo: entry.logInfo,
      meta: entry.meta,
      args: entry.args.map((value) => value instanceof Error
        ? { name: value.name, message: value.message, stack: value.stack }
        : value),
    };

    try {
      void fetchImpl(options.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((error: unknown) => options.onError?.(error));
    } catch (error) {
      options.onError?.(error);
    }
  };
}
