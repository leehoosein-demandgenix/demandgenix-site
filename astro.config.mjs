// astro.config.mjs
import { defineConfig } from 'astro/config';
import errorReporter from './src/integrations/error-reporter.js';

export default defineConfig({
  site: 'https://demandgenix.uk',
  integrations: [errorReporter()],
  vite: {
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