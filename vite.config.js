import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `vite preview` serve /projetos/stack10 a partir de dist/projetos/stack10/index.html,
// como fazem Vercel, Netlify, Cloudflare Pages e GitHub Pages com as páginas pré-renderizadas.
function previewDirectoryIndex() {
  return {
    name: 'preview-directory-index',
    configurePreviewServer(server) {
      const outDir = join(server.config.root, server.config.build.outDir);
      server.middlewares.use((req, _res, next) => {
        const [pathname, query = ''] = (req.url || '/').split('?');
        if (pathname !== '/' && !pathname.includes('.')) {
          const clean = pathname.replace(/\/+$/, '');
          if (existsSync(join(outDir, clean, 'index.html'))) req.url = `${clean}/index.html${query ? `?${query}` : ''}`;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), previewDirectoryIndex()],
});
