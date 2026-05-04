import { writeFile } from 'node:fs/promises'
import * as esbuild from 'esbuild'

const result = await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  packages: 'external',
  platform: 'node',
  format: 'esm',
  minify: true,
  outfile: 'dist/index.js',
  metafile: true,
  sourcemap: true,
  inject: ['src/polyfill.js'],
})

await writeFile('dist/index.metafile.json', JSON.stringify(result.metafile))

console.log('🎉 Build complete!')
