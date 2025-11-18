/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  packageManager: 'pnpm',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'jest',
  jest: {
    config: require('./jest.config.js'),
    enableFindRelatedTests: true,
  },
  checkers: ['typescript'],
  tsconfigFile: 'tsconfig.json',
  coverageAnalysis: 'perTest',
  mutate: [
    'lib/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/*.spec.{ts,tsx}',
    '!**/*.test.{ts,tsx}',
    '!**/*.stories.{ts,tsx}',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/dist/**',
  ],
  incremental: true,
  incrementalFile: '.stryker-incremental.json',
  thresholds: {
    high: 80,
    low: 60,
    break: 50,
  },
  maxConcurrentTestRunners: 4,
  tempDirName: '.stryker-tmp',
  cleanTempDir: true,
  logLevel: 'info',
  fileLogLevel: 'off',
  allowEmpty: false,
  ignoreStatic: true,
  disableTypeChecks: '{lib,components,app}/**/*.{ts,tsx}',
}
