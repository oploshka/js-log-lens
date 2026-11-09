import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LogLens, LogLensModule, LogLevel, ConsoleModule } from '../../lib/index.js';

class CollectorModule extends LogLensModule {
  installed = 0;
  uninstalled = 0;
  entries = [];

  install() { this.installed++; }
  uninstall() { this.uninstalled++; }
  filter(entry) { return entry.logInfo.level === LogLevel.Error; }
  run(entry) { this.entries.push(entry); }
}

test('manager filters, disables, enables and removes modules', () => {
  const lens = new LogLens();
  const module = new CollectorModule();
  const log = lens.build();
  lens.modules.add('collector', module);
  assert.equal(module.installed, 1);

  log.debug('skip');
  log.error('capture');
  assert.equal(module.entries.length, 1);
  lens.modules.disable('collector');
  log.error('disabled');
  assert.equal(module.entries.length, 1);
  assert.equal(module.uninstalled, 0);
  lens.modules.enable('collector');
  log.error('enabled');
  assert.equal(module.entries.length, 2);
  assert.equal(lens.modules.remove('collector'), true);
  assert.equal(module.uninstalled, 1);
  log.error('removed');
  assert.equal(module.entries.length, 2);
});

test('duplicate name or instance is ignored without throwing', () => {
  const lens = new LogLens();
  const first = new CollectorModule();
  const second = new CollectorModule();
  const originalError = console.error;
  const diagnostics = [];
  console.error = (...args) => diagnostics.push(args);
  try {
    lens.modules.add('first', first);
    assert.doesNotThrow(() => lens.modules.add('first', second));
    assert.doesNotThrow(() => lens.modules.add('second', first));
    assert.equal(first.installed, 1);
    assert.equal(second.installed, 0);
    assert.equal(lens.modules.get('second'), undefined);
    assert.equal(diagnostics.length, 2);
  } finally {
    console.error = originalError;
    lens.dispose();
  }
});

test('install, filter, run and uninstall errors do not stop logging', () => {
  const lens = new LogLens();
  const collected = [];
  const originalError = console.error;
  console.error = () => {};
  try {
    lens.modules.add('install-error', {
      install() { throw new Error('install failed'); },
      uninstall() {},
      filter() { return true; },
      run() {},
    });
    assert.equal(lens.modules.get('install-error'), undefined);

    lens.modules.add('filter-error', {
      install() {},
      uninstall() { throw new Error('uninstall failed'); },
      filter() { throw new Error('filter failed'); },
      run() {},
    });
    lens.modules.add('run-error', {
      install() {},
      uninstall() {},
      filter() { return true; },
      run() { throw new Error('run failed'); },
    });
    lens.modules.add('collector', {
      install() {},
      uninstall() {},
      filter() { return true; },
      run(entry) { collected.push(entry); },
    });
    assert.doesNotThrow(() => lens.build().error('still delivered'));
    assert.equal(collected.length, 1);
    assert.doesNotThrow(() => lens.modules.remove('filter-error'));
  } finally {
    lens.dispose();
    console.error = originalError;
  }
});

test('setSettings replaces, mergeSettings updates, defaults remain available', () => {
  const module = new ConsoleModule({
    settings: { includeMeta: true },
  });
  assert.equal(module.getSettings().includeMeta, true);
  module.mergeSettings({ includeMeta: false });
  assert.equal(module.getSettings().includeMeta, false);
  module.setSettings({ includeMeta: true, styles: {} });
  assert.deepEqual(module.getSettings(), { includeMeta: true, styles: {} });
  assert.equal(ConsoleModule.getDefaultSettings().includeMeta, false);
});

test('console module formats output without replacing original arguments', () => {
  const messages = [];
  const lens = new LogLens();
  lens.modules.add('console', new ConsoleModule({
    dependencies: {
      console: { log: (...args) => messages.push(args) },
    },
    settings: { includeMeta: true },
  }));
  const payload = { id: 1 };
  lens.build().child('WebSocket', { module: 'ws' }).info('connected', payload);
  assert.equal(messages.length, 1);
  assert.match(messages[0][0], /INFO/);
  assert.equal(messages[0][2], 'connected');
  assert.strictEqual(messages[0][3], payload);
  assert.deepEqual(messages[0][4], { module: 'ws' });
});
