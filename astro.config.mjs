// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://belskiy.kz',
  base: '/',
  vite: {
    plugins: [tailwindcss()]
  }
});