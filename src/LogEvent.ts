import type { sLogStructure, tLogListener } from './Type/Log';

/** Delivers ready log records. Filtering belongs to subscribers/modules. */
export class LogEvent {
  private readonly listeners = new Set<tLogListener>();

  emitLog(entry: sLogStructure): void {
    for (const listener of this.listeners) {
      listener(entry);
    }
  }

  subscribe(listener: tLogListener): () => void {
    this.listeners.add(listener);
    return () => this.unsubscribe(listener);
  }

  unsubscribe(listener: tLogListener): void {
    this.listeners.delete(listener);
  }
}
