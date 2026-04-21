import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/index.ts'],
  // bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: 'dist/hi.js',
  banner: {
    js: '#!/usr/bin/env node',
  },
})

console.log('🎉 Build complete!')
