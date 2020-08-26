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
    'csstools/use-nesting': ['always', { except: /&:(hover|focus)/ }],
    'no-empty-source': null,
    'plugin/declaration-block-no-ignored-properties': true,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
  },
}
