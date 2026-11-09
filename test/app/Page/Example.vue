<script setup lang="ts">
import { inject, ref } from 'vue';
import { AppLogKey } from '@app/LogContext';
import LogControls from '@app/Component/LogControls.vue';
import LogViewer from '@app/Component/LogViewer.vue';

const context = inject(AppLogKey);
if (!context) throw new Error('AppLog context is missing');

const { lens, log, entries, pageModule } = context;
const pageEnabled = ref(true);

function togglePageOutput(): void {
  pageEnabled.value = !pageEnabled.value;
  if (pageEnabled.value) {
    lens.modules.enable('page');
  } else {
    lens.modules.disable('page');
  }
}
</script>

<template>
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
    <LogControls :log="log" />
    <LogViewer
      :entries="entries"
      :enabled="pageEnabled"
      @toggle="togglePageOutput"
      @clear="pageModule.clear()"
    />
  </section>
</template>
