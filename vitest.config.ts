import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'tests/occupation-coverage.unit.spec.ts',
      'tests/occupation-coverage.integration.spec.ts',
    ],
  },
});
