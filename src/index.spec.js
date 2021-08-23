import { endent, mapValues } from '@dword-design/functions'
import packageName from 'depcheck-package-name'
import { Builder, Nuxt } from 'nuxt'
import outputFiles from 'output-files'
import withLocalTmpDir from 'with-local-tmp-dir'

const tsconfig = {
  compilerOptions: {
    allowJs: true,
    baseUrl: '.',
    esModuleInterop: true,
    experimentalDecorators: true,
    lib: ['ESNext', 'ESNext.AsyncIterable', 'DOM'],
    module: 'ESNext',
    moduleResolution: 'Node',
    noEmit: true,
    paths: {
      '@/*': ['./*'],
      '~/*': ['./*'],
    },
    sourceMap: true,
    strict: true,
    target: 'ES2018',
    types: ['@types/node', '@nuxt/types'],
  },
  exclude: ['node_modules'],
}

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
  false: {
    config: {
      modules: ['~/../src', '~/modules/module'],
    },
    files: {
      'modules/module.js': endent`
        export default function () {
          this.extendRoutes(routes =>
            expect(routes[0].meta.foo).toEqual(false)
          )
        }
      `,
      'pages/index.vue': endent`
        <script>
        export default {
          foo: false,
          render: () => <div />
        }
        </script>

      `,
    },
  },
  'js file': {
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
      'pages/index.js': endent`
        export default {
          foo: true,
          render: () => <div />
        }

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
  'predefined properties': {
    config: {
      modules: ['~/../src', '~/modules/module'],
    },
    files: {
      'modules/module.js': endent`
        export default function () {
          this.extendRoutes(routes =>
            expect(routes[0].meta).toEqual({})
          )
        }
      `,
      'pages/index.vue': endent`
        <script>
        export default {
          computed: {
            foo: () => {},
          },
          data: () => ({ foo: 'bar' }),
          methods: {
            foo: () => {},
          },
          mixins: [{}],
          render: () => <div />,
          watch: {
            foo: () => {},
          },
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
  'typescript: class api': {
    config: {
      buildModules: [packageName`@nuxt/typescript-build`],
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
        <template>
          <div />
        </template>
        
        <script lang="ts">
        import Vue from 'vue'

        export default class extends Vue {
          meta = {
            foo: true,
          }
        }
        </script>

      `,
      'tsconfig.json': JSON.stringify(tsconfig),
    },
  },
  'typescript: class api plain object inside': {
    config: {
      buildModules: [packageName`@nuxt/typescript-build`],
      modules: ['~/../src'],
    },
    error: 'Nuxt build error',
    files: {
      'pages/index.vue': endent`
        <template>
          <div />
        </template>
        
        <script lang="ts">
        import Vue from 'vue'

        export default class MyComponent extends Vue {
          meta: {
            foo: true,
          }
        }
        </script>

      `,
      'tsconfig.json': JSON.stringify(tsconfig),
    },
  },
  'typescript: class api with component name': {
    config: {
      buildModules: [packageName`@nuxt/typescript-build`],
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
        <template>
          <div />
        </template>
        
        <script lang="ts">
        import Vue from 'vue'

        export default class MyComponent extends Vue {
          meta = {
            foo: true,
          }
        }
        </script>

      `,
      'tsconfig.json': JSON.stringify(tsconfig),
    },
  },
  'typescript: object': {
    config: {
      buildModules: [packageName`@nuxt/typescript-build`],
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
        <template>
          <div />
        </template>
        
        <script lang="ts">
        const foo: number = 1
        export default {
          foo: true,
        }
        </script>

      `,
      'tsconfig.json': JSON.stringify(tsconfig),
    },
  },
  'typescript: options api': {
    config: {
      buildModules: [packageName`@nuxt/typescript-build`],
      modules: ['~/../src', '~/modules/module'],
    },
    error: 'Nuxt build error',
    files: {
      'modules/module.js': endent`
        export default function () {
          this.extendRoutes(routes =>
            expect(routes[0].meta.foo).toEqual(true)
          )
        }
      `,
      'pages/index.vue': endent`
        <template>
          <div />
        </template>
        
        <script lang="ts">
        import Vue from 'vue'

        export default Vue.extend({
          meta: {
            foo: true,
          }
        })
        </script>

      `,
      'tsconfig.json': JSON.stringify(tsconfig),
    },
  },
  'typescript: property decorator': {
    config: {
      buildModules: [packageName`@nuxt/typescript-build`],
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
        <template>
          <div />
        </template>
        
        <script lang="ts">
        import { Vue, Component } from '${packageName`vue-property-decorator`}'

        @Component
        export default class extends Vue {
          meta = {
            foo: true,
          }
        }
        </script>

      `,
      'tsconfig.json': JSON.stringify(tsconfig),
    },
  },
} |> mapValues(runTest)
