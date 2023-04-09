import packageName from 'depcheck-package-name'

export default {
  extends: [
    `${packageName`stylelint-config-hudochenkov`}/order`,
    `${packageName`stylelint-prettier`}/recommended`,
  ],
  plugins: [
    packageName`stylelint-use-nesting`,
    packageName`stylelint-declaration-block-no-ignored-properties`,
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
