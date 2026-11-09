import type { iLogEvent, sLogStructure, tLogListener } from './Type/Log';

/** Доставляет каждую готовую запись подписчикам без собственной фильтрации. */
export function createLogEvent(): iLogEvent {
  const listeners = new Set<tLogListener>();

  return {
    emitLog(entry: sLogStructure): void {
      for (const listener of listeners) {
        listener(entry);
      }
    },

    subscribe(listener: tLogListener): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },

    unsubscribe(listener: tLogListener): void {
      listeners.delete(listener);
    },
  };
}
