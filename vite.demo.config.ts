import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const resolveRoot = (pathname: string) => fileURLToPath(new URL(pathname, import.meta.url));

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  resolve: {
    tsconfigPaths: true,
    dedupe: ['vue'],
  },
  root: resolveRoot('./test/app/'),
  base: mode === 'ph-pages' ? '/js-log-lens/' : '/',
  build: {
    outDir: resolveRoot('./dist/'),
    emptyOutDir: true,
  },
}));
