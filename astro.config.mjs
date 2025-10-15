// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://demandgenix.uk',
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