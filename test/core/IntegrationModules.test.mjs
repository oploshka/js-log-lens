import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GlobalErrorModule, LogLens, LogLevel, NetworkModule } from '../../lib/index.js';

test('network module transforms entries and invokes the custom request callback', () => {
  const calls = [];
  const lens = new LogLens();
  const network = new NetworkModule({
    dependencies: {
      transform: (entry) => ({
        severity: entry.logInfo.level,
        module: entry.meta.module,
      }),
      request: (payload) => { calls.push(payload); },
    },
  });
  lens.modules.add('network', network);
  lens.build().child('WebSocket', { module: 'ws' }).debug('connected');
  assert.deepEqual(calls, [{ severity: LogLevel.Debug, module: 'ws' }]);
  lens.modules.disable('network');
  lens.build().error('disabled');
  assert.equal(calls.length, 1);
  lens.modules.enable('network');
  lens.build().error('enabled');
  assert.equal(calls.length, 2);
  lens.dispose();
});

test('network errors are handled without propagating to log calls', async () => {
  const errors = [];
  const lens = new LogLens();
  lens.modules.add('network', new NetworkModule({
    dependencies: {
      transform: (entry) => entry.args,
      request: async () => { throw new Error('offline'); },
      onError: (error) => errors.push(error.message),
    },
  }));
  assert.doesNotThrow(() => lens.build().info('test'));
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(errors, ['offline']);
  lens.dispose();
});

test('a failing transform does not interrupt other subscribers', () => {
  const errors = [];
  const received = [];
  const lens = new LogLens();
  lens.modules.add('network', new NetworkModule({
    dependencies: {
      transform: () => { throw new Error('serialization'); },
      request: () => { throw new Error('must not run'); },
      onError: (error) => errors.push(error.message),
    },
  }));
  lens.event.subscribe((entry) => received.push(entry));
  assert.doesNotThrow(() => lens.build().error('hello'));
  assert.deepEqual(errors, ['serialization']);
  assert.equal(received.length, 1);
  lens.dispose();
});

test('global error module installs and removes browser event hooks', () => {
  const callbacks = new Map();
  const target = {
    addEventListener(type, handler) { callbacks.set(type, handler); },
    removeEventListener(type, handler) {
      if (callbacks.get(type) === handler) callbacks.delete(type);
    },
  };
  const lens = new LogLens();
  const entries = [];
  lens.event.subscribe((entry) => entries.push(entry));
  const module = new GlobalErrorModule({
    dependencies: { logger: lens.build(), target: target },
  });
  lens.modules.add('global-errors', module);
  assert.equal(callbacks.size, 2);

  const failure = new Error('broken');
  callbacks.get('error')({ message: 'broken', error: failure });
  callbacks.get('unhandledrejection')({ reason: failure });
  assert.equal(entries.length, 2);
  assert.strictEqual(entries[0].args[1], failure);
  assert.equal(entries[0].logInfo.level, LogLevel.Error);
  assert.equal(entries[1].logInfo.level, LogLevel.Error);

  lens.modules.remove('global-errors');
  assert.equal(callbacks.size, 0);
  lens.dispose();
});

test('global error module has no browser side effects in Node', () => {
  const lens = new LogLens();
  lens.modules.add('global-errors', new GlobalErrorModule({
    dependencies: { logger: lens.build() },
  }));
  assert.doesNotThrow(() => lens.dispose());
});
