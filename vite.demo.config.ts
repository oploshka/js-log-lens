import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const resolveRoot = (pathname: string) => fileURLToPath(new URL(pathname, import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    tsconfigPaths: true,
    dedupe: ['vue'],
  },
  root: resolveRoot('./test/app/'),
  base: './',
  build: {
    outDir: resolveRoot('./dist/'),
    emptyOutDir: true,
  },
});
