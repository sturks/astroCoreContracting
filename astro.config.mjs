import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import node from '@astrojs/node';

export default defineConfig({
  integrations: [
    tailwind(),
    react(),
    sitemap(),
    vue()
  ],
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  site: 'https://corecontracting.pro'
});