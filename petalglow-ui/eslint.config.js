import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';

// Initialize FlatCompat with the required parameters
const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended
});

export default [
  // Global ignores that apply to all configurations
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/dev-dist/**', '**/build/**', '**/public/**']
  },
  js.configs.recommended,
  // JavaScript files configuration
  {
    files: ['src/**/*.{js,jsx}'],
  },
  // Add TypeScript parser and plugin configuration
  ...compat.config({
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:@typescript-eslint/recommended', // Add TypeScript rules
    ],
    parser: '@typescript-eslint/parser', // Specify the TypeScript parser
    plugins: ['react', 'react-hooks', '@typescript-eslint'],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      // Disable rules that conflict with TypeScript
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-expressions': ["warn", {
        "allowShortCircuit": true,
        "allowTernary": true
      }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }),
  // Add separate configuration for TypeScript files
  {
    files: ['src/**/*.{ts,tsx}'],
    // Remove duplicate ignores here since we have global ignores
  },
  
  // Global language options
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];
