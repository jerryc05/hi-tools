import { writeFile } from 'node:fs/promises'
import * as esbuild from 'esbuild'

const result = await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  // packages: 'external',
  platform: 'node',
  format: 'esm',
  minify: true,
  outfile: 'dist/index.js',
  metafile: true,
  inject: ['src/polyfill.js'],
  plugins: [
    {
      name: 'bundle-byted',
      setup(build) {
        // 拦截所有不以 "." 或 "/" 开头的路径（即 npm 包）
        build.onResolve({ filter: /^[^./]/ }, args => {
          if (args.path.startsWith('@byte') || ['qrcode'].includes(args.path)) {
            return null // 返回 null 让 esbuild 继续按常规逻辑打包它
          }
          return { path: args.path, external: true } // 否则标记为外部
        })
      },
    },
  ],
})

await writeFile(
  'dist/index.metafile.json',
  JSON.stringify(result.metafile, null, 2),
)

console.log('🎉 Build complete!')
