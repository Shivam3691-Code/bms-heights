// Build / dev server for BMS Heights — esbuild only (no Vite, no Tailwind).
import * as esbuild from 'esbuild';
import { cpSync, rmSync, mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
const serve = args.includes('--serve');
const preview = args.includes('--preview');
const outdir = 'dist';

if (preview) {
  const ctx = await esbuild.context({});
  const { port } = await ctx.serve({ servedir: outdir, port: 4173 });
  console.log(`Previewing production build at http://localhost:${port}`);
} else {
  rmSync(outdir, { recursive: true, force: true });
  mkdirSync(outdir, { recursive: true });
  cpSync('public', outdir, { recursive: true, filter: (src) => !src.endsWith('.gitkeep') });

  const options = {
    entryPoints: { app: 'src/index.jsx' },
    bundle: true,
    splitting: true,
    format: 'esm',
    outdir: `${outdir}/static`,
    entryNames: '[name]',
    chunkNames: 'chunks/[name]-[hash]',
    jsx: 'automatic',
    loader: { '.js': 'jsx', '.jsx': 'jsx' },
    target: ['es2020', 'safari14'],
    minify: !serve,
    sourcemap: serve,
    legalComments: 'none',
    define: { 'process.env.NODE_ENV': JSON.stringify(serve ? 'development' : 'production') },
    logLevel: 'info',
  };

  if (serve) {
    const ctx = await esbuild.context(options);
    await ctx.watch();
    const { port } = await ctx.serve({ servedir: outdir, port: 5173 });
    console.log(`Dev server running at http://localhost:${port}`);
  } else {
    const result = await esbuild.build({ ...options, metafile: true });
    console.log(await esbuild.analyzeMetafile(result.metafile, { verbose: false }));
  }
}
