import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig, loadEnv, type Connect, type Plugin } from 'vite';
import { handleWeatherRequest } from './api/weather';

// Serves /api/weather from the same handler Vercel deploys, so `npm run dev`
// and `npm run preview` work without the Vercel CLI. The key is read here, on
// the Node side, and is never passed to `define`, so it stays out of the bundle.
function weatherApi(apiKey: string | undefined): Plugin {
  const middleware: Connect.NextHandleFunction = (req, res) => {
    const url = new URL(req.originalUrl ?? req.url ?? '/', 'http://localhost');
    handleWeatherRequest(new Request(url, { method: req.method ?? 'GET' }), { apiKey })
      .then(async (response) => {
        res.statusCode = response.status;
        response.headers.forEach((value, name) => res.setHeader(name, value));
        res.end(await response.text());
      })
      .catch(() => {
        res.statusCode = 500;
        res.end();
      });
  };

  return {
    name: 'weather-api',
    configureServer(server) {
      server.middlewares.use('/api/weather', middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/weather', middleware);
    },
  };
}

export default defineConfig(({ mode }) => {
  // Empty prefix: read OPENWEATHER_API_KEY from .env files and the shell.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss(), weatherApi(env.OPENWEATHER_API_KEY)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
