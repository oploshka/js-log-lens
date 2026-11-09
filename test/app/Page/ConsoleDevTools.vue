<script setup lang="ts">
import { onUnmounted } from 'vue';
import { ConsoleModule, LogLens, LogLevel } from 'js-log-lens';

/**
 * Dedicated console instance: includeMeta is enabled for manual inspection.
 * Kept separate from the shared playground logger to avoid duplicate output.
 */
const lens = new LogLens().use('console-devtools', new ConsoleModule({
  settings: { includeMeta: true },
}));
const log = lens.build();
const levels = Object.values(LogLevel);

function emitLevel(level: LogLevel): void {
  log[level](`DevTools ${level} callsite`, { level, source: 'ConsoleDevTools' });
}

function emitObject(): void {
  const object = { nested: { id: 123 }, array: [1, 2, 3] };
  log.info('Inspect the object reference', object);
}

function emitChild(): void {
  const ws = log.child('WebSocket', { module: 'ws' });
  ws.info('DevTools child callsite', { id: 123 });
}

function emitMeta(): void {
  log.child('WebSocket', { module: 'ws' })
    .meta({ requestId: 42 })
    .debug('DevTools temporary metadata', { id: 2 });
}

function emitError(): void {
  log.error('DevTools Error object', new Error('Sample failure'));
}

onUnmounted(() => lens.dispose());
</script>

<template>
  <section class="intro">
    <p class="eyebrow">
      Browser-only verification
    </p>
    <h1>Console DevTools</h1>
    <p class="lead">
      Open Chrome or Firefox DevTools, then use these buttons to examine console
      formatting, structured objects, metadata and source links.
    </p>
  </section>

  <section class="workspace">
    <div class="controls">
      <div class="section-heading">
        <h2>Severity methods</h2>
        <span>ConsoleModule</span>
      </div>
      <div class="level-grid">
        <button
          v-for="level in levels"
          :key="level"
          type="button"
          class="level-button"
          @click="emitLevel(level)"
        >
          <span class="level-dot" :class="'dot-' + level" />
          {{ level }}
        </button>
      </div>

      <div class="section-heading second-heading">
        <h2>Inspect arguments and context</h2>
        <span>Manual checks</span>
      </div>
      <div class="context-actions">
        <button type="button" @click="emitObject">
          Original object and nested data
        </button>
        <button type="button" @click="emitChild">
          child('WebSocket').info(...)
        </button>
        <button type="button" @click="emitMeta">
          child().meta({ requestId }).debug(...)
        </button>
        <button type="button" @click="emitError">
          error('Message', new Error(...))
        </button>
      </div>
    </div>

    <div class="log-panel devtools-guide">
      <div class="panel-header">
        <div>
          <h2>Verification checklist</h2>
          <span>Inspect the browser console, not this panel</span>
        </div>
      </div>
      <div class="guide-content">
        <p>Open the browser DevTools Console before clicking the buttons.</p>
        <ol>
          <li>Check the styled severity labels for all eight levels.</li>
          <li>Expand the original object, nested properties and Error object.</li>
          <li>Inspect inherited <code>module: 'ws'</code> and temporary <code>requestId: 42</code> metadata.</li>
          <li>Click the file/line source link next to each console message.</li>
          <li>Compare the linked file and line against the handlers in <code>Page/ConsoleDevTools.vue</code>.</li>
          <li>Repeat in Chrome and Firefox, and compare with source maps enabled or disabled if needed.</li>
        </ol>
        <p>
          <strong>Known limitation:</strong> The console call happens inside
          ConsoleModule, so DevTools may link to that implementation rather than
          to the button handler. Capturing the original callsite remains a TODO.
        </p>
        <p>
          This is a manual browser check. Node.js unit tests cannot verify
          the DevTools source-link behavior.
        </p>
      </div>
    </div>
  </section>
</template>
