// Jest configuration for Mint Replica application

module.exports = {
  // Use ts-jest for TypeScript files
  preset: 'ts-jest',

  // Set the test environment to node
  testEnvironment: 'node',

  // Define the root directory for tests
  roots: ['<rootDir>/src'],

  // Specify the test match patterns
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],

  // Configure the transform for TypeScript files
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },

  // Enable collecting coverage information
  collectCoverage: true,

  // Specify the directory where Jest should output coverage files
  coverageDirectory: 'coverage',

  // Set coverage thresholds to ensure adequate test coverage
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Configure module name mapping for absolute imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  // Specify setup files to run after Jest is initialized
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  // Configure global settings for ts-jest
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  }
};