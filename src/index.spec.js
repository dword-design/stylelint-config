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
  const lintResult = await stylelint.lint({ config, code: options.code })
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
  'indent too big': {
    code: endent`
      body {
          background: red;
      }

    `,
    result: ['Expected indentation of 2 spaces (indentation)'],
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
    result: ['Expected empty line before rule (rule-empty-line-before)'],
  },
  'no blank line at inner selector': {
    code: endent`
      body {
        .foo {
          background: red;
        }
      }

    `,
    result: ['Expected empty line before rule (rule-empty-line-before)'],
  },
  global: {
    code: endent`
      :global(.foo) {
        background: red;
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
  'no leading zero': {
    code: endent`
      body {
        margin: .5rem;
      }

    `,
  },
  'empty file': {
    code: '',
  },
  'no nesting: child': {
    code: endent`
      body {
        margin: .5rem;
      }

      body .foo {
        padding: .5rem;
      }

    `,
    result: ['Expected "body .foo" inside "body". (csstools/use-nesting)'],
  },
  'no nesting: class': {
    code: endent`
      body {
        margin: .5rem;
      }

      body.foo {
        padding: .5rem;
      }

    `,
    result: ['Expected "body.foo" inside "body". (csstools/use-nesting)'],
  },
  'no nesting: attribute': {
    code: endent`
      body {
        margin: .5rem;
      }

      body[data-foo] {
        padding: .5rem;
      }

    `,
    result: ['Expected "body[data-foo]" inside "body". (csstools/use-nesting)'],
  },
} |> mapValues(runTest)
