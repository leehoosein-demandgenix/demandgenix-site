// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import errorReporter from './src/integrations/error-reporter.js';

export default defineConfig({
  site: 'https://demandgenix.uk',
  integrations: [errorReporter()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: false
    }
  },
  build: {
    assets: '_astro',
    inlineStylesheets: 'auto'
  },
  compressHTML: true
});