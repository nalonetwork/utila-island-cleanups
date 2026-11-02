import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://utilaislandcleanups.org',
  output: 'static',
  vite: {
    envPrefix: ['VITE_', 'PUBLIC_'],
  },
});
