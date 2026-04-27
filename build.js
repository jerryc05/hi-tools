import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  packages: 'external',
  platform: 'node',
  format: 'esm',
  minify: true,
  outfile: 'dist/index.js',
  inject: ['src/polyfill.js'],
})

console.log('🎉 Build complete!')
