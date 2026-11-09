<script setup lang="ts">
import { LogLevel } from 'js-log-lens';
import type { LogAdapter } from 'js-log-lens';
import { logContext, logLevel, logTemporaryMeta } from '@app/Usage/Levels';

defineProps<{
  log: LogAdapter;
}>();

const levels = Object.values(LogLevel);
</script>

<template>
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
</template>
