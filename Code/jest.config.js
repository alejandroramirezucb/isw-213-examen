module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverage: true,
  collectCoverageFrom: ['server/utils-calculos.js'],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
};
