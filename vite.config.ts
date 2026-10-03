import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'content-saver',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = req.url || '';
            const targetPath = path.resolve(__dirname, 'src/data/content.json');

            if (url === '/api/content' || url.startsWith('/api/content?') || url === '/api/save-content') {
              if (req.method === 'GET') {
                try {
                  if (fs.existsSync(targetPath)) {
                    const fileData = fs.readFileSync(targetPath, 'utf-8');
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                    res.end(fileData);
                    return;
                  }
                } catch (e) {
                  console.error('Error reading content.json:', e);
                }
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Content file not found' }));
                return;
              }

              if (req.method === 'POST') {
                let body = '';
                req.on('data', (chunk) => {
                  body += chunk;
                });
                req.on('end', () => {
                  try {
                    const data = JSON.parse(body);
                    fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf-8');
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: true }));
                  } catch (e: unknown) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: false, error: String(e) }));
                  }
                });
                return;
              }

              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Method Not Allowed' }));
              return;
            }

            next();
          });
        },
      },
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify — file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
