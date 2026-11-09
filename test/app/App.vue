<script setup lang="ts">
import Example from '@app/Page/Example.vue';
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

    <Example />

    <footer>
      <span>js-log-lens · Experimental API</span>
      <a href="https://github.com/oploshka/js-log-lens/tree/develop">
        Source and documentation ↗
      </a>
    </footer>
  </main>
</template>
