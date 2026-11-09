import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LogLens, LogLevel } from '../../lib/index.js';

test('all PSR severity methods emit structured entries with original arguments', () => {
  let tick = 100;
  const lens = new LogLens(undefined, () => ++tick);
  const entries = [];
  const stop = lens.event.subscribe((entry) => entries.push(entry));
  const log = lens.build();
  const payload = { message: 'original reference' };

  for (const level of Object.values(LogLevel)) {
    log[level]('hello', payload);
  }

  assert.equal(entries.length, Object.values(LogLevel).length);
  for (const [index, level] of Object.values(LogLevel).entries()) {
    assert.equal(entries[index].logInfo.level, level);
    assert.equal(entries[index].logInfo.timestamp, 101 + index);
    assert.deepEqual(entries[index].args, ['hello', payload]);
    assert.strictEqual(entries[index].args[1], payload);
    assert.deepEqual(entries[index].meta, {});
  }
  stop();
});

test('child inherits meta with local precedence and retains logger ancestry', () => {
  const lens = new LogLens();
  const entries = [];
  lens.event.subscribe((entry) => entries.push(entry));
  const root = lens.build();
  const ws = root.child('WebSocket', { module: 'ws', source: 'parent' });
  const connection = ws.child('Connection', { connectionId: '123', source: 'child' });

  connection.debug('Connected');
  ws.info('Parent unchanged');
  root.notice('Root unchanged');

  assert.deepEqual(entries[0].meta, {
    module: 'ws',
    source: 'child',
    connectionId: '123',
  });
  assert.deepEqual(entries[1].meta, { module: 'ws', source: 'parent' });
  assert.deepEqual(entries[2].meta, {});
  assert.equal(entries[0].logInfo.logger.name, 'Connection');
  assert.equal(entries[0].logInfo.logger.parent.name, 'WebSocket');
  assert.strictEqual(connection.parentLog, ws);
  assert.strictEqual(ws.parentLog, root);
  assert.strictEqual(entries[0].logInfo.logger, connection.origin);
});

test('meta() is one-shot and returns only severity methods', () => {
  const lens = new LogLens();
  const entries = [];
  lens.event.subscribe((entry) => entries.push(entry));
  const ws = lens.build().child('WebSocket', { module: 'ws' });
  const once = ws.meta({ requestId: 42 });

  assert.equal(typeof once.debug, 'function');
  assert.equal(once.child, undefined);
  assert.equal(once.meta, undefined);

  once.info('Request', { id: 123 });
  ws.info('Next');
  assert.deepEqual(entries[0].meta, { module: 'ws', requestId: 42 });
  assert.deepEqual(entries[0].args, ['Request', { id: 123 }]);
  assert.deepEqual(entries[1].meta, { module: 'ws' });
});

test('unnamed child is supported and does not overwrite parent meta', () => {
  const lens = new LogLens();
  const entries = [];
  lens.event.subscribe((entry) => entries.push(entry));
  const child = lens.build().child({ module: 'anonymous' });
  child.debug('Test');
  assert.equal(entries[0].meta.module, 'anonymous');
  assert.equal(entries[0].logInfo.logger.name, undefined);
});
