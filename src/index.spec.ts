import { expect, test } from '@playwright/test';
import endent from 'endent';
import stylelint from 'stylelint';

import config from '.';

interface TestConfig {
  code: string;
  filename?: string;
  messages?: string[];
  output?: string;
}

const tests: Record<string, TestConfig> = {
  'empty file': { code: '' },
  global: {
    code: endent`
      :global(.foo) {
        background: red;
      }\n
    `,
  },
  'global function': {
    code: endent`
      body {
        background: lighten(red, 10%);
      }\n
    `,
  },
  'indent too big': {
    code: endent`
      body {
          background: red;
      }\n
    `,
    messages: ['Delete "··" (prettier/prettier)'],
    output: endent`
      body {
        background: red;
      }\n
    `,
  },
  'no blank line at inner selector': {
    code: endent`
      body {
        .foo {
          background: red;
        }
      }\n
    `,
  },
  'no blank line between selectors': {
    code: endent`
      body {
        background: red;
      }
      html {
        background: green;
      }\n
    `,
    messages: ['Expected empty line before rule (rule-empty-line-before)'],
    output: endent`
      body {
        background: red;
      }

      html {
        background: green;
      }\n
    `,
  },
  'no leading zero': {
    code: endent`
      body {
        margin: .5rem;
      }\n
    `,
    messages: ['Insert "0" (prettier/prettier)'],
    output: endent`
      body {
        margin: 0.5rem;
      }\n
    `,
  },
  'no line break after operator': {
    code: endent`
      .is-dark-transparent-bg {
        background-color: hsl(
          var(--bulma-scheme-h) var(--bulma-scheme-s) var(--bulma-scheme-invert-l) /
            20%
        );
      }\n
    `,
  },
  'no nesting: attribute': {
    code: endent`
      body {
        margin: 0.5rem;
      }

      body[data-foo] {
        padding: 0.5rem;
      }\n
    `,
    messages: [
      'Expected "body[data-foo]" inside "body". (csstools/use-nesting)',
    ],
    output: endent`
      body {
        margin: 0.5rem;

        &[data-foo] {
          padding: 0.5rem;
        }
      }\n
    `,
  },
  'no nesting: child': {
    code: endent`
      body {
        margin: 0.5rem;
      }

      body .foo {
        padding: 0.5rem;
      }\n
    `,
    messages: ['Expected "body .foo" inside "body". (csstools/use-nesting)'],
    output: endent`
      body {
        margin: 0.5rem;

        & .foo {
          padding: 0.5rem;
        }
      }\n
    `,
  },
  'no nesting: class': {
    code: endent`
      body {
        margin: 0.5rem;
      }

      body.foo {
        padding: 0.5rem;
      }\n
    `,
    messages: ['Expected "body.foo" inside "body". (csstools/use-nesting)'],
    output: endent`
      body {
        margin: 0.5rem;

        &.foo {
          padding: 0.5rem;
        }
      }\n
    `,
  },
  'no nesting: pseudo selector': {
    code: endent`
      body {
        margin: 0.5rem;
      }

      body:hover {
        padding: 0.5rem;
      }\n
    `,
    messages: ['Expected "body:hover" inside "body". (csstools/use-nesting)'],
    output: endent`
      body {
        margin: 0.5rem;

        &:hover {
          padding: 0.5rem;
        }
      }\n
    `,
  },
  sass: {
    code: endent`
      %foo {
        background: red;
      }

      body {
        @extend %foo;
      }\n
    `,
  },
  'specificity no endless loop': {
    // TODO: no-descending-specificity leads to an endless loop here. Swapping the order of the parent selectors will always lead to errors. See also https://github.com/stylelint/stylelint/issues?q=is%3Aissue%20state%3Aopen%20no-descending-specificity.
    code: endent`
      .a1 .a2 {
        .child1 {
          color: red;
        }

        .child2 {
          color: red;
        }
      }

      .b1 {
        .child1 {
          color: red;
        }

        .c1 .c2 .child2 {
          color: red;
        }
      }\n
    `,
  },
  'tailwind css': {
    code: endent`
      @tailwind base;
      @tailwind components;
      @tailwind utilities;

      @layer components {
        .btn-primary {
          @apply py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700;
        }
      }\n
    `,
    filename: 'tailwind.css',
  },
  valid: {
    code: endent`
      body {
        background: red;
      }\n
    `,
  },
  vue: {
    code: endent`
      <template>
        <div />
      </template>

      <style lang="scss" scoped>
      .foo {
        color: red;
      }
      </style>\n
    `,
    filename: 'index.vue',
  },
  'wrong property order': {
    code: endent`
      body {
        background: red;
        position: absolute;
      }\n
    `,
    messages: [
      'Expected "position" to come before "background" (order/properties-order)',
    ],
    output: endent`
      body {
        position: absolute;
        background: red;
      }\n
    `,
  },
};

for (const [name, _testConfig] of Object.entries(tests)) {
  const testConfig = { messages: [], output: _testConfig.code, ..._testConfig };

  test(name, async () => {
    const {
      results: [firstResult],
    } = await stylelint.lint({
      code: testConfig.code,
      codeFilename: testConfig.filename,
      config,
    });

    const messages = [
      ...firstResult.deprecations,
      ...firstResult.invalidOptionWarnings,
      ...firstResult.parseErrors,
      ...firstResult.warnings,
    ].map(_ => _.text);

    expect(messages).toEqual(testConfig.messages);

    const { code: firstOutput } = await stylelint.lint({
      code: testConfig.code,
      codeFilename: testConfig.filename,
      config,
      fix: true,
    });

    const { code: output } = await stylelint.lint({
      code: firstOutput,
      codeFilename: testConfig.filename,
      config,
      fix: true,
    });

    expect(output).toEqual(testConfig.output);
  });
}
