import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

function devApiPlugin(): Plugin {
  return {
    name: 'dev-api-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];
        if (url === '/api/ai/analyze') {
          try {
            const { default: handler } = await import('./api/ai/analyze.ts');
            await handler(req, res);
          } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Internal Server Error';
            res.statusCode = 500;
            res.end(JSON.stringify({ error: message }));
          }
          return;
        }
        if (url === '/api/ai/status') {
          try {
            const { default: handler } = await import('./api/ai/status.ts');
            await handler(req, res);
          } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Internal Server Error';
            res.statusCode = 500;
            res.end(JSON.stringify({ error: message }));
          }
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devApiPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        content: resolve(__dirname, 'src/content.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'content' ? 'content.js' : 'assets/[name]-[hash].js';
        },
      },
    },
  },
});

