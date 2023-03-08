/* eslint-disable unicorn/prefer-module */
module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'unicorn'],
  extends: [
    'plugin:unicorn/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:promise/recommended',
    'plugin:@cspell/recommended',
  ],
  overrides: [
    {
      files: ['**/*.ts'],
      parser: 'babel-eslint',
      rules: {
        'prettier/prettier': 'error',
        strict: 'off',
        'unicorn/no-await-expression-member': 'off',
        'unicorn/no-useless-promise-resolve-reject': 'off',
        'unicorn/no-null': 'off',
        'unicorn/prefer-module': 'off',
        'unicorn/explicit-length-check': 'off',
        'unicorn/no-array-callback-reference': 'off',
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/prefer-top-level-await': 'off',
        'import/no-dynamic-require': 'off',
        'global-require': 'off',
        'require-yield': 'off',
        'unicorn/filename-case': 'off',
        'unicorn/prefer-logical-operator-over-ternary': 'off',
        'unicorn/prefer-array-some': 'off',
        'unicorn/prefer-node-protocol': 'off',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          },
        ],
        '@cspell/spellchecker': [
          'warn',
          {
            checkStrings: false,
            customWordListFile: __dirname + '/words.txt',
          },
        ],
      },
    },
    {
      files: ['*.ts', '*.mts', '*.cts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          },
        ],
        '@cspell/spellchecker': [
          'warn',
          {
            checkStrings: false,
            customWordListFile: __dirname + '/words.txt',
          },
        ],
      },
    },
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
        tsconfigRootDir: __dirname,
      },
      rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          },
        ],
        '@cspell/spellchecker': [
          'warn',
          {
            checkStrings: false,
            customWordListFile: __dirname + '/words.txt',
          },
        ],
      },
    },
    {
      files: ['**/*.spec.ts', '**/*.ispec.ts', '**/*.e2e-spec.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
      },
      rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'unicorn/prefer-module': 'off',
        'no-useless-escape': 'off',
        'unicorn/filename-case': 'off',
        'promise/valid-params': 'off',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          },
        ],
        '@cspell/spellchecker': [
          'warn',
          {
            checkStrings: false,
            customWordListFile: __dirname + '/words.txt',
          },
        ],
      },
    },
  ],
};
