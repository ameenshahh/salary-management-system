module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'sonarjs'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:sonarjs/recommended-legacy',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist'],
  rules: {
    complexity: ['error', 5],
    'sonarjs/cognitive-complexity': ['error', 5],
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
