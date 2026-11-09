<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';
import { LogLevel } from 'js-log-lens';
import type { sLogStructure } from 'js-log-lens';
import { setupLogger } from '@example/Project/setupLogger';
import { PageLogModule } from '@app/Module/PageLog';
import { logContext, logLevel, logTemporaryMeta } from '@app/Usage/levels';

const { lens, log } = setupLogger();
const entries = ref<readonly sLogStructure[]>([]);
const pageModule = new PageLogModule({
  dependencies: {
    onEntriesChange: (nextEntries) => {
      entries.value = nextEntries;
    },
  },
  settings: { maxEntries: 100 },
});
lens.modules.add('page', pageModule);

const levels = Object.values(LogLevel);
const pageEnabled = ref(true);
const displayedEntries = computed(() => [...entries.value].reverse());

function togglePageOutput(): void {
  pageEnabled.value = !pageEnabled.value;
  if (pageEnabled.value) {
    lens.modules.enable('page');
  } else {
    lens.modules.disable('page');
  }
}

function formatArg(value: unknown): string {
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (typeof value === 'string') return value;
  try {
    const json = JSON.stringify(value);
    return json ?? String(value);
  } catch {
    return '[Unserializable value]';
  }
}

function origin(entry: sLogStructure): string {
  const names: string[] = [];
  let current = entry.logInfo.logger;
  while (current) {
    if (current.name) names.unshift(current.name);
    current = current.parent;
  }
  return names.join(' / ') || 'Root';
}

onUnmounted(() => lens.dispose());
</script>

<template>
  <main class="page">
    <header class="topbar">
      <a class="wordmark" href="./" aria-label="LogLens home">
        LogLens
      </a>
      <a class="github" href="https://github.com/oploshka/js-log-lens">
        GitHub repository ↗
      </a>
    </header>

    <section class="intro">
      <p class="eyebrow">
        JavaScript logging library · Interactive playground
      </p>
      <h1>See logs<br>in context.</h1>
      <p class="lead">
        Trigger logging methods on the left and inspect structured entries on the right.
        Every action also goes to the browser console.
      </p>
    </section>

    <section class="workspace">
      <div class="controls">
        <div class="section-heading">
          <h2>Log levels</h2>
          <span>PSR-3</span>
        </div>
        <div class="level-grid">
          <button
            v-for="level in levels"
            :key="level"
            type="button"
            class="level-button"
            @click="logLevel(log, level)"
          >
            <span class="level-dot" :class="'dot-' + level" />
            {{ level }}
          </button>
        </div>
        <div class="section-heading second-heading">
          <h2>Context</h2>
          <span>meta &amp; child</span>
        </div>
        <div class="context-actions">
          <button type="button" @click="logContext(log)">
            child('WebSocket') → child('Connection')
          </button>
          <button type="button" @click="logTemporaryMeta(log)">
            meta({ requestId }).debug(...)
          </button>
        </div>
        <p class="tip">
          Page history is a test-only LogLensModule. Production modules remain independent of Vue.
        </p>
      </div>

      <div class="log-panel">
        <div class="panel-header">
          <div>
            <h2>Live entries</h2>
            <span>{{ entries.length }} / 100 saved</span>
          </div>
          <div class="panel-actions">
            <button type="button" @click="togglePageOutput">
              {{ pageEnabled ? 'Pause' : 'Resume' }}
            </button>
            <button type="button" @click="pageModule.clear()">
              Clear
            </button>
          </div>
        </div>
        <div class="entries" aria-live="polite">
          <p v-if="displayedEntries.length === 0" class="empty">
            No entries yet. Select a log level to start.
          </p>
          <article
            v-for="(entry, index) in displayedEntries"
            :key="entry.logInfo.timestamp + '-' + index"
            class="entry"
          >
            <div class="entry-top">
              <span class="entry-level" :class="'tag-' + entry.logInfo.level">
                {{ entry.logInfo.level }}
              </span>
              <span class="entry-time">
                {{ new Date(entry.logInfo.timestamp).toLocaleTimeString() }}
              </span>
            </div>
            <div class="entry-source">
              {{ origin(entry) }}
            </div>
            <div class="entry-args">
              <div v-for="(arg, argIndex) in entry.args" :key="argIndex">
                {{ formatArg(arg) }}
              </div>
            </div>
            <pre v-if="Object.keys(entry.meta).length" class="entry-meta">{{ JSON.stringify(entry.meta, null, 2) }}</pre>
          </article>
        </div>
      </div>
    </section>

    <footer>
      <span>js-log-lens · Experimental API</span>
      <a href="https://github.com/oploshka/js-log-lens/tree/develop">
        Source and documentation ↗
      </a>
    </footer>
  </main>
</template>

<style>
:root {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #0c111c;
  color: #edf2fb;
  font-synthesis: none;
}
* { box-sizing: border-box; }
body { margin: 0; }
a { color: inherit; text-decoration: none; }
button { font: inherit; cursor: pointer; }
.page { max-width: 1440px; margin: auto; padding: 0 36px; }
.topbar { padding: 26px 0; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #293246; }
.wordmark { font-size: 23px; font-weight: 750; letter-spacing: -.05em; }
.github { font-size: 13px; color: #aebbd2; }
.intro { padding: 60px 0 40px; }
.eyebrow { margin: 0 0 14px; color: #9bb8fb; text-transform: uppercase; letter-spacing: .15em; font-size: 12px; }
h1 { margin: 0; font-size: clamp(48px, 7vw, 82px); line-height: 1; letter-spacing: -.07em; }
.lead { color: #aebad1; max-width: 660px; line-height: 1.6; font-size: 16px; margin: 20px 0 0; }
.workspace { display: grid; grid-template-columns: minmax(300px, 0.87fr) minmax(0, 1.4fr); gap: 20px; align-items: start; padding-bottom: 80px; }
.controls, .log-panel { border: 1px solid #303a50; background: #151d2c; border-radius: 16px; overflow: hidden; }
.controls { padding: 24px; }
.section-heading { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 18px; }
.section-heading h2, .panel-header h2 { font-size: 17px; margin: 0; letter-spacing: -.02em; }
.section-heading span, .panel-header span { font-size: 12px; color: #91a1bd; }
.level-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.level-button, .context-actions button, .panel-actions button { color: #edf2fb; background: #212c41; border: 1px solid #3b4c67; border-radius: 9px; }
.level-button { padding: 13px 12px; display: flex; align-items: center; gap: 10px; text-align: left; text-transform: capitalize; }
button:hover { background: #304261; }
button:focus-visible { outline: 2px solid #a6c1ff; outline-offset: 2px; }
.level-dot { width: 8px; height: 8px; border-radius: 50%; background: #899bb4; }
.dot-emergency, .dot-alert, .dot-critical, .dot-error { background: #f17e91; }
.dot-warning { background: #eeb46e; }
.dot-notice, .dot-info { background: #76b7fc; }
.dot-debug { background: #a4b3c9; }
.second-heading { margin-top: 32px; }
.context-actions { display: flex; flex-direction: column; gap: 10px; }
.context-actions button { padding: 13px 14px; text-align: left; font-size: 13px; }
.tip { color: #8798b4; line-height: 1.6; font-size: 12px; margin: 24px 0 0; }
.log-panel { min-height: 480px; }
.panel-header { padding: 21px 23px; display: flex; justify-content: space-between; gap: 12px; border-bottom: 1px solid #303a50; }
.panel-header > div:first-child { display: flex; flex-direction: column; gap: 5px; }
.panel-actions { display: flex; gap: 8px; align-items: center; }
.panel-actions button { padding: 8px 11px; font-size: 12px; }
.entries { height: 500px; overflow: auto; }
.empty { color: #90a1bd; font-size: 14px; text-align: center; padding: 78px 22px; }
.entry { padding: 16px 23px; border-bottom: 1px solid #2a3548; }
.entry-top { display: flex; justify-content: space-between; gap: 12px; align-items: center; }
.entry-level { display: inline-flex; border-radius: 5px; background: #354158; padding: 4px 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
.tag-error, .tag-critical, .tag-emergency, .tag-alert { background: #56303b; color: #ffa3ae; }
.tag-warning { background: #534333; color: #ffd18a; }
.tag-info, .tag-notice { background: #263f58; color: #a0d4ff; }
.entry-time { color: #8798b4; font-size: 11px; font-variant-numeric: tabular-nums; }
.entry-source { color: #91acd0; font-size: 12px; margin-top: 9px; }
.entry-args { margin-top: 8px; font-size: 13px; line-height: 1.6; overflow-wrap: anywhere; white-space: pre-wrap; }
.entry-meta { font-size: 11px; color: #b5c3d9; background: #101725; border: 1px solid #2c3a50; border-radius: 7px; margin: 12px 0 0; padding: 10px; white-space: pre-wrap; overflow-wrap: anywhere; }
footer { border-top: 1px solid #293246; padding: 25px 0 35px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; color: #8193af; font-size: 12px; }
@media (max-width: 860px) {
  .page { padding: 0 20px; }
  .intro { padding: 48px 0 30px; }
  .workspace { grid-template-columns: 1fr; }
  .entries { height: 420px; }
}
</style>
