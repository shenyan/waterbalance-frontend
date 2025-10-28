/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parserOptions: {
    project: './tsconfig.json'
  },
  extends: ['next/core-web-vitals', 'plugin:@tanstack/eslint-plugin-query/recommended'],
  settings: {
    next: {
      rootDir: ['src/']
    }
  }
};
