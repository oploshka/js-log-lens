import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

const resolveRoot = (pathname: string) => fileURLToPath(new URL(pathname, import.meta.url));

export default defineConfig({
  resolve: { tsconfigPaths: true },
  build: {
    outDir: resolveRoot('./lib/'),
    emptyOutDir: true,
    lib: {
      entry: resolveRoot('./src/index.js'),
      formats: ['es'],
      fileName: 'index',
    },
  },
});
