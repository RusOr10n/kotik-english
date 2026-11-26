import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { type Plugin, build, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

const ROOT = path.dirname(fileURLToPath(import.meta.url));

/** Номер сборки: вшивается в игру и кладётся в version.json — по нему игра узнаёт, что вышла новая версия */
const BUILD_ID = Date.now().toString(36);

function versionFile(): Plugin {
  return {
    name: 'kitty-version-file',
    apply: 'build',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ build: BUILD_ID }) });
    },
  };
}

/**
 * В режиме разработки отдаёт свежую сборку игры одним HTML-файлом по адресу /__standalone.html.
 * Её использует кнопка «Перенос на другой компьютер».
 */
function standaloneForDev(): Plugin {
  return {
    name: 'kitty-standalone-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__standalone.html', async (_req, res) => {
        const outDir = path.join(ROOT, 'node_modules/.kitty-standalone');
        // dev-сервер выставил NODE_ENV=development — для файла переноса нужна боевая сборка
        const prevEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';
        try {
          await build({ root: ROOT, configFile: path.join(ROOT, 'vite.config.ts'), mode: 'production', logLevel: 'error', build: { outDir, emptyOutDir: true } });
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(fs.readFileSync(path.join(outDir, 'index.html'), 'utf8'));
        } catch (e) {
          res.statusCode = 500;
          res.end(String(e));
        } finally {
          process.env.NODE_ENV = prevEnv;
        }
      });
    },
  };
}

export default defineConfig({
  base: './',
  // сборка — один самодостаточный index.html: его можно открыть двойным щелчком на любом компьютере
  plugins: [react(), viteSingleFile(), standaloneForDev(), versionFile()],
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  test: { environment: 'node', include: ['tests/**/*.test.{ts,tsx}'] },
} as any);
