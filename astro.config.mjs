// astro.config.mjs - Fixed for Tailwind v4
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://demandgenix.uk',
  vite: {
    plugins: [tailwindcss()]
  }
});