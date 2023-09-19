module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'plugin:react-hooks/recommended',
    'plugin:lodash-fp/recommended'
  ],
  plugins: ['import', '@typescript-eslint', 'prettier', 'react-hooks'],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'lf', jsxSingleQuote: false }],
    'import/extensions': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
    'comma-dangle': 0,
    'react/function-component-definition': 0,
    'object-curly-newline': 0,
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'jsx-quotes': [2, 'prefer-double'],
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/triple-slash-reference': 0,
    'max-len': 0,
    '@typescript-eslint/no-empty-interface': 1,
    'no-param-reassign': 0,
    'react/button-has-type': 0,
    'import/prefer-default-export': 0,
    'no-promise-executor-return': 0,
    'operator-linebreak': 0,
    'implicit-arrow-linebreak': 0,
    indent: [0, 0],
    'import/no-cycle': 0,
    'import/order': [
      2,
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type']
      }
    ],
    'react/prop-types': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'react/display-name': 0,
    'react/react-in-jsx-scope': 0,
    'react/require-default-props': 0,
    'react/jsx-props-no-spreading': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'warn',
    'jsx-a11y/alt-text': 0
  },
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.ts', '.tsx']
      }
    },
    react: {
      version: 'detect'
    }
  }
};
