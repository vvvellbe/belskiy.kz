// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind'; // <-- ИМПОРТИРУЕМ ПРАВИЛЬНУЮ ИНТЕГРАЦИЮ

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://belskiy.kz',
  base: '/',
  integrations: [tailwind(), sitemap()] // <-- ПОДКЛЮЧАЕМ ЕЕ ЗДЕСЬ
});