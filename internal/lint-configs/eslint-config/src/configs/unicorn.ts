import type { Linter } from 'eslint';

import { interopDefault } from '../util';

export async function unicorn(): Promise<Linter.Config[]> {
  const [pluginUnicorn] = await Promise.all([interopDefault(import('eslint-plugin-unicorn'))] as const);

  return [
    {
      plugins: {
        unicorn: pluginUnicorn,
      },
      rules: {
        ...pluginUnicorn.configs.recommended.rules,

        'unicorn/better-regex': 'off',
        'unicorn/consistent-destructuring': 'off',
        'unicorn/consistent-function-scoping': 'off',
        'unicorn/expiring-todo-comments': 'off',
        'unicorn/explicit-length-check': 'off',
        'unicorn/filename-case': 'off',
        'unicorn/import-style': 'off',
        'unicorn/no-array-for-each': 'off',
        'unicorn/no-array-reduce': 'off',
        'unicorn/no-nested-ternary': 'off',
        'unicorn/no-null': 'off',
        'unicorn/no-useless-undefined': 'off',
        'unicorn/numeric-separators-style': 'off',
        'unicorn/prefer-array-find': 'off',
        'unicorn/prefer-at': 'off',
        'unicorn/prefer-dom-node-text-content': 'off',
        'unicorn/prefer-export-from': ['error', { ignoreUsedVariables: true }],
        'unicorn/prefer-global-this': 'off',
        // 允许使用三元运算符
        'unicorn/prefer-logical-operator-over-ternary': 'off',
        'unicorn/prefer-query-selector': 'off',
        'unicorn/prefer-top-level-await': 'off',
        'unicorn/prevent-abbreviations': 'off',
      },
    },
    {
      files: ['scripts/**/*.?([cm])[jt]s?(x)', 'internal/**/*.?([cm])[jt]s?(x)'],
      rules: {
        'unicorn/no-process-exit': 'off',
      },
    },
  ];
}
