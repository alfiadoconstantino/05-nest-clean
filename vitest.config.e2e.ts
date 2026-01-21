import { resolve } from 'path'
import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vitest-tsconfig-paths'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    setupFiles: ['./test/setup-e2e.setup.ts'],
    hookTimeout: 30000, // 30s
  },
  plugins: [
    tsConfigPaths(),
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
    }),
  ],
  resolve: {
    alias: {
      // Ensure Vitest correctly resolves TypeScript path aliases
      // '@/generated/prisma': resolve(__dirname, 'src/generated/prisma/index.js'),
      src: resolve(__dirname, './src'),
    },
  },
})
