import packageName from 'depcheck-package-name';

export default {
  extends: [
    packageName`stylelint-config-standard-scss`,
    `${packageName`stylelint-config-hudochenkov`}/order`,
    `${packageName`stylelint-prettier`}/recommended`,
    `${packageName`stylelint-config-recommended-vue`}/scss`,
  ],
  overrides: [
    {
      extends: [packageName`stylelint-config-tailwindcss`],
      files: ['**/*.css'],
      rules: { 'scss/at-rule-no-unknown': null },
    },
  ],
  plugins: [
    packageName`stylelint-use-nesting`,
    packageName`stylelint-declaration-block-no-ignored-properties`,
  ],
  rules: {
    'csstools/use-nesting': ['always', { except: /&:(hover|focus)/ }],
    'no-descending-specificity': null, // TODO: See specificity test and https://github.com/stylelint/stylelint/issues?q=is%3Aissue%20state%3Aopen%20no-descending-specificity
    'no-empty-source': null,
    'plugin/declaration-block-no-ignored-properties': true,
    'scss/no-global-function-names': null,
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global'] },
    ],
  },
};
