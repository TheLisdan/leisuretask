import { sentryVitePlugin } from '@sentry/vite-plugin';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import { parsePublicEnv } from './src/lib/parsePublicEnv';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const publicEnv = parsePublicEnv(env);

  if (env.SENTRY_AUTH_TOKEN && !env.SOURCE_VERSION) {
    throw new Error('SOURCE_VERSION is required when SENTRY_AUTH_TOKEN is set');
  }

  return {
    plugins: [
      react(),
      legacy({
        targets: ['> 0.01%'],
      }),
      env.HOST_ENV !== 'local'
        ? undefined
        : visualizer({
            filename: './dist/bundle-stats.html',
            gzipSize: true,
            brotliSize: true,
          }),
      !env.SENTRY_AUTH_TOKEN
        ? undefined
        : sentryVitePlugin({
            org: 'leisuretask',
            project: 'webapp',
            authToken: env.SENTRY_AUTH_TOKEN,
            release: { name: env.SOURCE_VERSION },
          }),
    ],
    css: {
      postcss: {
        plugins: [autoprefixer({})],
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            vendor: ['lodash', 'date-fns', 'js-cookie'],
            query: ['@tanstack/react-query'],
            ui: [
              'framer-motion',
              '@radix-ui/react-dropdown-menu',
              'react-modal',
            ],
          },
        },
      },
      sourcemap: true,
      chunkSizeWarningLimit: 900,
    },
    server: {
      port: +env.PORT,
    },
    preview: {
      port: +env.PORT,
    },
    define: {
      'process.env': publicEnv,
    },
  };
});
