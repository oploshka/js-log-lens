import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LogEvent, LogLens } from '../../lib/index.js';

test('subscribe and unsubscribe retain synchronous delivery order', () => {
  const event = new LogEvent();
  const order = [];
  const stopFirst = event.subscribe(() => order.push('first'));
  event.subscribe(() => order.push('second'));
  const log = new LogLens(event).build();

  log.debug('one');
  assert.deepEqual(order, ['first', 'second']);
  stopFirst();
  log.debug('two');
  assert.deepEqual(order, ['first', 'second', 'second']);
});

test('a throwing subscriber cannot prevent delivery to subsequent subscribers', () => {
  const event = new LogEvent();
  const received = [];
  const originalError = console.error;
  const errors = [];
  console.error = (...args) => errors.push(args);
  try {
    event.subscribe(() => { throw new Error('failed listener'); });
    event.subscribe((entry) => received.push(entry));
    assert.doesNotThrow(() => new LogLens(event).build().info('still delivered'));
    assert.equal(received.length, 1);
    assert.equal(errors.length, 1);
  } finally {
    console.error = originalError;
  }
});
