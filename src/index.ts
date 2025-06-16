import packageName from 'depcheck-package-name';
import stylelintUseNesting from 'stylelint-use-nesting';

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
      files: ['**/tailwind.css'],
      rules: {
        'at-rule-no-unknown': [
          true,
          {
            ignoreAtRules: [
              'tailwind',
              'apply',
              'layer',
              'config',
              'screen',
              'variants',
              'responsive',
              'plugin',
            ],
          },
        ],
        'scss/at-rule-no-unknown': null,
      },
    },
  ],
  plugins: [
    stylelintUseNesting, // "CommonJS plugins are deprecated" error when listing it as a string
    packageName`stylelint-declaration-block-no-ignored-properties`,
  ],
  rules: {
    'csstools/use-nesting': ['always', { except: /&:(hover|focus)/ }],
    'no-empty-source': null,
    'plugin/declaration-block-no-ignored-properties': true,
    'scss/no-global-function-names': null,
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global'] },
    ],
  },
};
