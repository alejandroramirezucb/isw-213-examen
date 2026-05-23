module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'utils-calculos.js',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**',
  ],
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageDirectory: 'coverage',
  passWithNoTests: true,
};
