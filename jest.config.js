require('dotenv').config()

module.exports = {
  moduleDirectories: ['node_modules', 'src'],
  setupFilesAfterEnv: ['./testSetupPerFile.js', 'jest-extended'],
  testEnvironment: 'node',
  clearMocks: true,
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js?)$',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  moduleFileExtensions: ['js', 'json', 'node'],
  transformIgnorePatterns: ['node_modules/(?!(babel-jest)/)'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70
    }
  },
  coverageReporters: ['html', 'text-summary'],
  collectCoverageFrom: ['src/**/*.js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/config/'],
  verbose: true
}
