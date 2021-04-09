import { endent, mapValues } from '@dword-design/functions'
import packageName from 'depcheck-package-name'
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
    if (config.error) {
      await expect(new Builder(nuxt).build()).rejects.toThrow(config.error)
    } else {
      await new Builder(nuxt).build()
    }
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
  'babel syntax with config': {
    config: {
      build: {
        babel: {
          babelrc: true,
        },
      },
      modules: ['~/../src'],
    },
    files: {
      '.babelrc.json': JSON.stringify({
        plugins: [
          [
            packageName`@babel/plugin-proposal-pipeline-operator`,
            { proposal: 'fsharp' },
          ],
        ],
      }),
      'pages/index.vue': endent`
        <script>
        export default {
          foo: 1 |> x => x * 2,
        }
        </script>

      `,
    },
  },
  'babel syntax without config': {
    config: {
      modules: ['~/../src'],
    },
    error:
      "Support for the experimental syntax 'pipelineOperator' isn't currently enabled",
    files: {
      'pages/index.vue': endent`
        <script>
        export default {
          foo: 1 |> x => x * 2,
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
      modules: ['~/../src'],
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
