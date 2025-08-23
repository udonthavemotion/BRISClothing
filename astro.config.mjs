import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid', // Allow both static and server-side rendering
  adapter: vercel({
    webAnalytics: { enabled: true },
    functionPerRoute: false,
    edgeMiddleware: false,
    // Use the latest supported Node.js runtime
    runtime: 'nodejs20.x'
  }),
  site: 'https://brisco.vercel.app', // Vercel production domain
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          // Add hash to filenames for cache busting
          entryFileNames: '_astro/[name].[hash].js',
          chunkFileNames: '_astro/[name].[hash].js',
          assetFileNames: '_astro/[name].[hash][extname]'
        }
      }
    }
  }
});
