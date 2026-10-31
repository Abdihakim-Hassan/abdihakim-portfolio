import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'portrait-save-middleware',
        configureServer(server) {
          server.middlewares.use('/api/save-portrait', (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end('Method Not Allowed');
              return;
            }
            let body = '';
            req.on('data', (chunk) => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const { dataUrl } = JSON.parse(body);
                const matches = dataUrl.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/);
                if (!matches) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Invalid image data' }));
                  return;
                }
                const buffer = Buffer.from(matches[1], 'base64');
                const targets = [
                  path.resolve(__dirname, 'public/abdihakim_studio_portrait.jpg'),
                  path.resolve(__dirname, 'src/assets/images/abdihakim_studio_final.jpg'),
                  path.resolve(__dirname, 'src/assets/images/abdihakim_final_portrait.jpg'),
                ];
                for (const target of targets) {
                  fs.writeFileSync(target, buffer);
                }
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: true }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: String(err) }));
              }
            });
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
