import {
  endent,
  first,
  flatten,
  map,
  mapValues,
  pick,
  property,
  values,
} from '@dword-design/functions'
import stylelint from 'stylelint'

import config from '.'

const runTest = test => async () => {
  test = { messages: [], output: test.code, ...test }

  const messages =
    stylelint.lint({
      code: test.code,
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
      config,
      fix: true,
    })
    |> await
    |> property('output')

  const output =
    stylelint.lint({
      code: firstOutput,
      config,
      fix: true,
    })
    |> await
    |> property('output')
  expect(output).toEqual(test.output)
}

export default {
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
} |> mapValues(runTest)
