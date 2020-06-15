import getPackageName from 'get-package-name'

export default {
  extends: [
    getPackageName(require.resolve('stylelint-config-standard')),
    getPackageName(require.resolve('stylelint-config-recommended-scss')),
    `${getPackageName(require.resolve('stylelint-config-hudochenkov'))}/order`,
    `${getPackageName(require.resolve('stylelint-prettier'))}/recommended`,
  ],
  plugins: [
    getPackageName(require.resolve('stylelint-use-nesting')),
    getPackageName(
      require.resolve('stylelint-declaration-block-no-ignored-properties')
    ),
  ],
  rules: {
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
    'csstools/use-nesting': 'always',
    'plugin/declaration-block-no-ignored-properties': true,
    'rule-empty-line-before': 'always',
    'no-empty-source': null,
  },
}
