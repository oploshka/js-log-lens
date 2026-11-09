<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import Example from '@app/Page/Example.vue';
import ConsoleDevTools from '@app/Page/ConsoleDevTools.vue';

const page = ref<'example' | 'devtools'>('example');

function syncPage(): void {
  page.value = window.location.hash === '#devtools' ? 'devtools' : 'example';
}

onMounted(() => {
  syncPage();
  window.addEventListener('hashchange', syncPage);
});
onUnmounted(() => window.removeEventListener('hashchange', syncPage));
</script>

<template>
  <main class="page">
    <header class="topbar">
      <a class="wordmark" href="#example" aria-label="LogLens home">
        LogLens
      </a>
      <nav class="page-nav" aria-label="Test pages">
        <a href="#example" :aria-current="page === 'example' ? 'page' : undefined">
          Playground
        </a>
        <a href="#devtools" :aria-current="page === 'devtools' ? 'page' : undefined">
          Console DevTools
        </a>
      </nav>
      <a class="github" href="https://github.com/oploshka/js-log-lens">
        GitHub repository ↗
      </a>
    </header>

    <ConsoleDevTools v-if="page === 'devtools'" />
    <Example v-else />

    <footer>
      <span>js-log-lens · Experimental API</span>
      <a href="https://github.com/oploshka/js-log-lens/tree/develop">
        Source and documentation ↗
      </a>
    </footer>
  </main>
</template>
