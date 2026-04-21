import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/index.ts'],
  // bundle: true,
  platform: 'node',
  format: 'esm',
  minify: true,
  outfile: 'dist/hi.js',
  inject: ['src/polyfill.js'],
})

console.log('🎉 Build complete!')
