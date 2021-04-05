import { endent, mapValues } from '@dword-design/functions'
import { Builder, Nuxt } from 'nuxt'
import outputFiles from 'output-files'
import withLocalTmpDir from 'with-local-tmp-dir'

const runTest = config => () =>
  withLocalTmpDir(async () => {
    await outputFiles(config.files)

    const nuxt = new Nuxt({
      createRequire: 'native',
      dev: false,
      ...config.config,
    })
    await new Builder(nuxt).build()
  })

export default {
  'additional properties': {
    config: {
      modules: ['~/../src', '~/modules/module'],
    },
    files: {
      'modules/module.js': endent`
        export default function () {
          this.extendRoutes(routes =>
            expect(routes[0].meta.foo).toEqual(true)
          )
        }
      `,
      'pages/index.vue': endent`
        <script>
        export default {
          foo: true,
          render: () => <div />
        }
        </script>

      `,
    },
  },
  array: {
    config: {
      modules: ['~/../src', '~/modules/module'],
    },
    files: {
      'modules/module.js': endent`
        export default function () {
          this.extendRoutes(routes =>
            expect(routes[0].meta.foo).toEqual([1, 2])
          )
        }
      `,
      'pages/index.vue': endent`
        <script>
        export default {
          meta: {
            foo: [1, 2],
          },
          render: () => <div />
        }
        </script>

      `,
    },
  },
  meta: {
    config: {
      modules: ['~/../src', '~/modules/module'],
    },
    files: {
      'modules/module.js': endent`
        export default function () {
          this.extendRoutes(routes =>
            expect(routes[0].meta.foo).toEqual(true)
          )
        }
      `,
      'pages/index.vue': endent`
        <script>
        export default {
          meta: {
            foo: true,
          },
          render: () => <div />
        }
        </script>

      `,
    },
  },
  'spread operator': {
    config: {
      modules: ['~/../src', '~/modules/module'],
    },
    files: {
      'pages/index.vue': endent`
        <script>
        export default {
          ...{ foo: 'bar' },
        }
        </script>

      `,
    },
  },
} |> mapValues(runTest)
