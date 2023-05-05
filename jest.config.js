module.exports = {
  preset: 'ts-jest',
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  roots: ['<rootDir>'],
  testMatch: [
    './__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['json-summary', 'text', 'lcov'],
}
