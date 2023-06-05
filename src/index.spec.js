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
        }

      `,
    },
    'indent too big': {
      code: endent`
        body {
            background: red;
        }

      `,
      messages: ['Delete "··" (prettier/prettier)'],
      output: endent`
        body {
          background: red;
        }

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
        }

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
        }

      `,
    },
    'no blank line at inner selector': {
      code: endent`
        body {
          .foo {
            background: red;
          }
        }

      `,
    },
    'no blank line between selectors': {
      code: endent`
        body {
          background: red;
        }
        html {
          background: green;
        }

      `,
      messages: ['Expected empty line before rule (rule-empty-line-before)'],
      output: endent`
        body {
          background: red;
        }

        html {
          background: green;
        }

      `,
    },
    'no leading zero': {
      code: endent`
        body {
          margin: .5rem;
        }

      `,
      messages: ['Insert "0" (prettier/prettier)'],
      output: endent`
        body {
          margin: 0.5rem;
        }

      `,
    },
    'no nesting: attribute': {
      code: endent`
        body {
          margin: 0.5rem;
        }

        body[data-foo] {
          padding: 0.5rem;
        }

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
        }

      `,
    },
    'no nesting: child': {
      code: endent`
        body {
          margin: 0.5rem;
        }

        body .foo {
          padding: 0.5rem;
        }

      `,
      messages: ['Expected "body .foo" inside "body". (csstools/use-nesting)'],
      output: endent`
        body {
          margin: 0.5rem;

          & .foo {
            padding: 0.5rem;
          }
        }

      `,
    },
    'no nesting: class': {
      code: endent`
        body {
          margin: 0.5rem;
        }

        body.foo {
          padding: 0.5rem;
        }

      `,
      messages: ['Expected "body.foo" inside "body". (csstools/use-nesting)'],
      output: endent`
        body {
          margin: 0.5rem;

          &.foo {
            padding: 0.5rem;
          }
        }

      `,
    },
    'no nesting: pseudo selector': {
      code: endent`
        body {
          margin: 0.5rem;
        }

        body:hover {
          padding: 0.5rem;
        }

      `,
      messages: ['Expected "body:hover" inside "body". (csstools/use-nesting)'],
      output: endent`
        body {
          margin: 0.5rem;

          &:hover {
            padding: 0.5rem;
          }
        }

      `,
    },
    sass: {
      code: endent`
        %foo {
          background: red;
        }

        body {
          @extend %foo;
        }

      `,
    },
    valid: {
      code: endent`
        body {
          background: red;
        }

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
        </style>

      `,
      filename: 'index.vue',
    },
    'wrong property order': {
      code: endent`
        body {
          background: red;
          position: absolute;
        }

      `,
      messages: [
        'Expected "position" to come before "background" (order/properties-order)',
      ],
      output: endent`
        body {
          position: absolute;
          background: red;
        }

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
          |> property('output')

        const output =
          stylelint.lint({
            code: firstOutput,
            codeFilename: test.filename,
            config,
            fix: true,
          })
          |> await
          |> property('output')
        expect(output).toEqual(test.output)
      },
    },
  ],
)
