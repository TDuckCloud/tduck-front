module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  rules: {
    'no-restricted-syntax': 0,
    'linebreak-style': 0,
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-unused-components': 0,
    'no-unused-vars': 0,
    'import/order': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'comma-dangle': [2, 'only-multiline'],
    semi: [2, 'never'],
    quotes: [
      2, 'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ],
    'no-unused-expressions': 0,
    'no-plusplus': 0,
    'import/prefer-default-export': 0,
    'no-use-before-define': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'no-constant-condition': 0,
    'arrow-parens': [1, 'always'],
    'vue/max-attributes-per-line': 0,
    'no-eval': 0,
    'no-multi-assign': 0,
    'prefer-rest-params': 0,
    'vue/require-prop-types': 0,
    'vue/no-mutating-props': 0,
    'vue/require-default-prop': 0,
    'vue/valid-v-bind-sync': 0,
    'vue/no-side-effects-in-computed-properties': 0,
    'vue/html-closing-bracket-spacing': 0,
    'vue/html-closing-bracket-newline': 0,
    'vue/no-v-html': 0,
    'vue/no-lone-template': 0,
    'no-prototype-builtins': 0,
    'no-restricted-globals': 0,
    'no-useless-escape': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals: {
    location: false
  }
}
