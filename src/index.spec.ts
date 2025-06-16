import { expect, test } from '@playwright/test';
import endent from 'endent';
import { pick } from 'lodash-es';
import stylelint from 'stylelint';

import config from '.';

const tests = {
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
  'nesting: inner nesting pseudo selector': {
    code: endent`
      body {
        margin: 0.5rem;

        img {
          padding: 0;
        }

        &:hover img {
          padding: 0.5rem;
        }
      }\n
    `,
    result: endent`
      body {
        margin: 0.5rem;

        img {
          padding: 0;
        }

      &:hover img {
        padding: 0.5rem;
      }
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
    codeFilename: 'tailwind.css',
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

    const messages = Object.values(
      pick(firstResult, [
        'deprecations',
        'invalidOptionWarnings',
        'parseErrors',
        'warnings',
      ]),
    )
      .flat()
      .map(_ => _.text);

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
