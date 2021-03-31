module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
  },
  extends: ['prettier'],
  ignorePatterns: ['webpack.*.js', 'dist/**/*'],
  rules: {
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
