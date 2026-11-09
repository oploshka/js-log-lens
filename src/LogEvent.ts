import type { sLogStructure, tLogListener } from './Type/Log';
import { reportLogLensError } from './reportLogLensError';

/** Synchronous fan-out; does not modify the entry or await listeners. */
export class LogEvent {
  private readonly listeners = new Set<tLogListener>();

  emitLog(entry: sLogStructure): void {
    for (const listener of this.listeners) {
      try {
        listener(entry);
      } catch (error) {
        reportLogLensError('Listener failed', error);
      }
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
