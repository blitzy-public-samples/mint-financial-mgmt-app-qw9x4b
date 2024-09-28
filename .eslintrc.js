module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'react-native',
    'prettier'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
    'prettier'
  ],
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true,
    'react-native/react-native': true
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prettier/prettier': 'error',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'prefer-const': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-var': 'error',
    'object-shorthand': ['error', 'always'],
    'prefer-template': 'error',
    'quotes': ['error', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'error',
    'react-native/no-inline-styles': 'error',
    'react-native/no-color-literals': 'error',
    'react-native/no-raw-text': 'error'
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      env: {
        jest: true
      }
    },
    {
      files: ['src/backend/**/*.ts'],
      env: {
        node: true,
        browser: false
      }
    },
    {
      files: ['src/frontend/**/*.ts', 'src/frontend/**/*.tsx'],
      env: {
        browser: true,
        node: false
      }
    },
    {
      files: ['src/mobile/**/*.ts', 'src/mobile/**/*.tsx'],
      env: {
        'react-native/react-native': true,
        browser: false,
        node: false
      }
    }
  ]
};

// Human Tasks:
// 1. Review and adjust ESLint rules based on team coding standards and project requirements
// 2. Ensure all developers have the necessary ESLint plugins installed in their development environments
// 3. Set up pre-commit hooks to run ESLint before allowing commits