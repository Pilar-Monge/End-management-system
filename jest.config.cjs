/** @type {import('jest').Config} */
module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.entity.ts',
    '!src/main.ts',
    '!src/data-source.ts',
    '!src/**/index.ts',
  ],
  coverageDirectory: 'coverage',
  clearMocks: true,
};