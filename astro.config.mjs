// astro.config.mjs
import { defineConfig } from 'astro/config';
import errorReporter from './src/integrations/error-reporter.js';
import markdownTwins from './src/integrations/markdown-twins.js';

export default defineConfig({
  site: 'https://demandgenix.uk',
  integrations: [errorReporter(), markdownTwins()],
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