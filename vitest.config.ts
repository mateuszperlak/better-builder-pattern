import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec,unit,integration}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
})
