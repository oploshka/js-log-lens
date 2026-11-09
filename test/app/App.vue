<script setup lang="ts">
import { ref } from 'vue';

const moduleName = ref('WebSocket');
</script>

<template>
  <main class="container">
    <h1>LogLens</h1>
    <p>Development playground for the JavaScript logger.</p>
    <label for="module">Example module</label>
    <input id="module" v-model="moduleName" />
    <p>Selected module: {{ moduleName }}</p>
    <p>The logger API is intentionally not implemented yet.</p>
  </main>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 4rem auto;
  padding: 0 1.5rem;
  font-family: system-ui, sans-serif;
}
input {
  display: block;
  padding: 0.5rem;
  margin-top: 0.5rem;
}
</style>
