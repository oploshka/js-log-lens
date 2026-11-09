<script setup lang="ts">
import { computed } from 'vue';
import type { sLogStructure } from 'js-log-lens';

const props = defineProps<{
  entries: readonly sLogStructure[];
  enabled: boolean;
}>();

defineEmits<{
  toggle: [];
  clear: [];
}>();

const displayedEntries = computed(() => [...props.entries].reverse());

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
</script>

<template>
  <div class="log-panel">
    <div class="panel-header">
      <div>
        <h2>Live entries</h2>
        <span>{{ entries.length }} / 100 saved</span>
      </div>
      <div class="panel-actions">
        <button type="button" @click="$emit('toggle')">
          {{ enabled ? 'Pause' : 'Resume' }}
        </button>
        <button type="button" @click="$emit('clear')">
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
</template>
