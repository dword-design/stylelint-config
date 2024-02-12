import {
  endent,
  first,
  flatten,
  map,
  pick,
  property,
  values,
} from '@dword-design/functions'
import tester from '@dword-design/tester'
import stylelint from 'stylelint'

import config from './index.js'

export default tester(
  {
    'empty file': {
      code: '',
    },
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
  },
  [
    {
      transform: test => async () => {
        test = { messages: [], output: test.code, ...test }

        const messages =
          stylelint.lint({
            code: test.code,
            codeFilename: test.filename,
            config,
          })
          |> await
          |> property('results')
          |> first
          |> pick([
            'deprecations',
            'invalidOptionWarnings',
            'parseErrors',
            'warnings',
          ])
          |> values
          |> flatten
          |> map('text')
        expect(messages).toEqual(test.messages)

        const firstOutput =
          stylelint.lint({
            code: test.code,
            codeFilename: test.filename,
            config,
            fix: true,
          })
          |> await
          |> property('code')

        const output =
          stylelint.lint({
            code: firstOutput,
            codeFilename: test.filename,
            config,
            fix: true,
          })
          |> await
          |> property('code')
        expect(output).toEqual(test.output)
      },
    },
  ],
)
