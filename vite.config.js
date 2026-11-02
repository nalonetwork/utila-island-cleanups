import { defineConfig } from 'vite';
import { resolve } from 'path';

const root = import.meta.dirname;

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        about: resolve(root, 'about.html'),
        contact: resolve(root, 'contact.html'),
        gallery: resolve(root, 'gallery.html'),
        getInvolved: resolve(root, 'get-involved.html'),
        impact: resolve(root, 'impact.html'),
        partners: resolve(root, 'partners.html'),
        admin: resolve(root, 'admin.html'),
      },
    },
  },
});
