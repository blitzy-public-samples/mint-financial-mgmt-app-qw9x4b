module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  plugins: [
    'react',
    'react-native',
    '@typescript-eslint'
  ],
  env: {
    'react-native/react-native': true
  },
  rules: {
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'error',
    'react-native/no-inline-styles': 'error',
    'react-native/no-color-literals': 'error',
    'react-native/no-raw-text': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    'react/prop-types': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};