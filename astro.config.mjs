// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind'; // <-- ИМПОРТИРУЕМ ПРАВИЛЬНУЮ ИНТЕГРАЦИЮ

export default defineConfig({
  site: 'https://belskiy.kz',
  base: '/',
  integrations: [tailwind()] // <-- ПОДКЛЮЧАЕМ ЕЕ ЗДЕСЬ
});