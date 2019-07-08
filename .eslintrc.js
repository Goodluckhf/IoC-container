module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint-config-airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/no-parameter-properties': [
      'error',
      {
        allows: ['private readonly'],
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'import/prefer-default-export': 'off',
    'no-useless-constructor': 'off',
    'no-empty-function': 'off',
    'class-methods-use-this': 'off',
    'new-cap': 'off',
    '@typescript-eslint/camelcase': 'off',
    'no-underscore-dangle': 'off',
  },
  overrides: [
    {
      files: ['*.spec.{ts,js}'],
      env: {
        jest: true,
      },
      rules: {
        'no-console': 'off',
        'import/no-extraneous-dependencies': 'off',
        'no-new': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-underscore-dangle': 'off',
        'no-restricted-syntax': 'off',
        'no-await-in-loop': 'off',
      },
    },
  ],
};
