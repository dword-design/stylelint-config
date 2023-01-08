import packageName from 'depcheck-package-name'

export default {
  extends: [
    packageName`stylelint-config-standard`,
    packageName`stylelint-config-recommended-scss`,
    `${packageName`stylelint-config-hudochenkov`}/order`,
    `${packageName`stylelint-prettier`}/recommended`,
  ],
  plugins: [
    packageName`stylelint-use-nesting`,
    packageName`stylelint-declaration-block-no-ignored-properties`,
  ],
  rules: {
    'csstools/use-nesting': 'always',
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
