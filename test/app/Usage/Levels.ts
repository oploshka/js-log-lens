import { LogLevel } from 'js-log-lens';
import type { LogAdapter } from 'js-log-lens';

/** Playground actions; regular application setup belongs in example/Install. */
export function logLevel(log: LogAdapter, level: LogLevel): void {
  const payload = {
    createdAt: new Date().toISOString(),
    source: 'playground',
  };

  if (level === LogLevel.Error || level === LogLevel.Critical || level === LogLevel.Emergency) {
    log[level](`Example ${level} message`, new Error(`Demo ${level}`), payload);
    return;
  }

  log[level](`Example ${level} message`, payload);
}

export function logContext(log: LogAdapter): void {
  const ws = log.child('WebSocket', { module: 'ws' });
  const connection = ws.child('Connection', { connectionId: 'demo-42' });
  connection.info('WebSocket connected', { attempt: 1 });
}

export function logTemporaryMeta(log: LogAdapter): void {
  log.meta({ requestId: 'req-demo-17' }).debug('One-time request metadata', { status: 'ok' });
}
