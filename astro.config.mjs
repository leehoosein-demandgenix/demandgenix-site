// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://demandgenix.uk',
  vite: {
    plugins: [tailwindcss()]
  },
  build: {
    assets: '_astro'
  },
  compressHTML: true,
  // Image optimization is enabled by default in Astro 5!
  // No additional config needed
});