import {
  endent,
  flatten,
  map,
  mapValues,
  pick,
  values,
} from '@dword-design/functions'
import stylelint from 'stylelint'

import config from '.'

const runTest = options => async () => {
  const expectedResult = options.result || []

  const lintResult = await stylelint.lint({ code: options.code, config })

  const actualResult =
    lintResult.results[0]
    |> pick([
      'deprecations',
      'invalidOptionWarnings',
      'parseErrors',
      'warnings',
    ])
    |> values
    |> flatten
    |> map('text')
  expect(actualResult).toEqual(expectedResult)
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
    result: ['Delete "··" (prettier/prettier)'],
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
    result: ['Insert "0" (prettier/prettier)'],
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
    result: ['Expected "body[data-foo]" inside "body". (csstools/use-nesting)'],
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
    result: ['Expected "body .foo" inside "body". (csstools/use-nesting)'],
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
    result: ['Expected "body.foo" inside "body". (csstools/use-nesting)'],
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
    result: ['Expected "body:hover" inside "body". (csstools/use-nesting)'],
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
    result: [
      'Expected "position" to come before "background" (order/properties-order)',
    ],
  },
} |> mapValues(runTest)
