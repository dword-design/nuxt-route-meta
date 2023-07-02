import { endent } from '@dword-design/functions'
import tester from '@dword-design/tester'
import testerPluginTmpDir from '@dword-design/tester-plugin-tmp-dir'
import packageName from 'depcheck-package-name'
import { execaCommand } from 'execa'
import outputFiles from 'output-files'

export default tester(
  {
    'additional properties': async () => {
      await outputFiles({
        'nuxt.config.js': endent`
          import expect from '${packageName`expect`}'

          export default {
            modules: [
              '../src/index.js',
              (options, nuxt) => nuxt.hook('pages:extend', routes => expect(routes[0].meta.foo).toEqual(true)),
            ],
          }
        `,
        'pages/index.vue': endent`
          <template>
            <div />
          </template>

          <script>
          export default {
            foo: true,
          }
          </script>
        `,
      })
      await execaCommand('nuxt build')
    },
    array: async () => {
      await outputFiles({
        'nuxt.config.js': endent`
          import expect from '${packageName`expect`}'

          export default {
            modules: [
              '../src/index.js',
              (options, nuxt) => nuxt.hook('pages:extend', routes => expect(routes[0].meta).toEqual({ foo: [1, 2] }))
            ],
          }
        `,
        'pages/index.vue': endent`
          <template>
            <div />
          </template>

          <script>
          export default {
            meta: {
              foo: [1, 2],
            },
          }
          </script>

        `,
      })
      await execaCommand('nuxt build')
    },
    babel: async () => {
      await outputFiles({
        '.babelrc.json': JSON.stringify({
          plugins: [
            [
              packageName`@babel/plugin-proposal-pipeline-operator`,
              { proposal: 'fsharp' },
            ],
          ],
        }),
        'nuxt.config.js': endent`
          import expect from '${packageName`expect`}'

          export default {
            modules: [
              '../src/index.js',
              (options, nuxt) => nuxt.hook('pages:extend', routes => expect(routes[0].meta).toEqual({ foo: true })),
            ],
          }
        `,
        'pages/index.vue': endent`
          <template>
            <div />
          </template>

          <script setup>
          1 |> x => x * 2

          definePageMeta({
            foo: true,
          })
          </script>
        `,
      })
      await execaCommand('nuxt-babel build')
    },
    composition: async () => {
      await outputFiles({
        'nuxt.config.js': endent`
          import expect from '${packageName`expect`}'

          export default {
            modules: [
              '../src/index.js',
              (options, nuxt) => nuxt.hook('pages:extend', routes => expect(routes[0].meta).toEqual({ foo: true })),
            ],
          }
        `,
        'pages/index.vue': endent`
          <template>
            <div />
          </template>

          <script setup>
          definePageMeta({
            foo: true,
          })
          </script>
        `,
      })
      await execaCommand('nuxt build')
    },
    false: async () => {
      await outputFiles({
        'nuxt.config.js': endent`
          import expect from '${packageName`expect`}'

          export default {
            modules: [
              '../src/index.js',
              (options, nuxt) => nuxt.hook('pages.extend', routes => expect(routes[0].meta).toEqual({ foo: false })),
            ],
          }
        `,
        'pages/index.vue': endent`
          <template>
            <div />
          </template>

          <script>
          export default {
            foo: false,
          }
          </script>
        `,
      })
      await execaCommand('nuxt build')
    },
    meta: async () => {
      await outputFiles({
        'nuxt.config.js': endent`
          import expect from '${packageName`expect`}'

          export default {
            modules: [
              '../src/index.js',
              (options, nuxt) => nuxt.hook('pages:extend', routes => expect(routes[0].meta).toEqual({ foo: true, bar: true })),
            ],
          }
        `,
        'pages/index.vue': endent`
          <template>
            <div />
          </template>

          <script>
          export default {
            bar: true,
            meta: {
              foo: true,
            },
          }
          </script>
        `,
      })
      await execaCommand('nuxt build')
    },
    'multiple routes': async () => {
      await outputFiles({
        'nuxt.config.js': endent`
          import expect from '${packageName`expect`}'

          export default {
            modules: [
              '../src/index.js',
              (options, nuxt) => nuxt.hook('pages:extend', routes => {
                expect(routes[0].path).toEqual('/bar')
                expect(routes[0].meta).toEqual({ bar: true })
                expect(routes[1].path).toEqual('/foo')
                expect(routes[1].meta).toEqual({ foo: true })
              }),
            ],
          }
        `,
        pages: {
          'bar.vue': endent`
            <template>
              <div />
            </template>

            <script>
            export default {
              meta: {
                bar: true,
              },
            }
            </script>
          `,
          'foo.vue': endent`
            <template>
              <div />
            </template>

            <script>
            export default {
              meta: {
                foo: true,
              },
            }
            </script>
          `,
        },
      })
      await execaCommand('nuxt build')
    },
    'predefined properties': async () => {
      await outputFiles({
        'nuxt.config.js': endent`
          import expect from '${packageName`expect`}'

          export default {
            modules: [
              '../src/index.js',
              (options, nuxt) => nuxt.hook('pages:extend', routes => expect(routes[0].meta).toEqual({})),
            ],
          }
        `,
        'pages/index.vue': endent`
          <script>
          export default {
            computed: {
              foo: () => {},
            },
            components: {
              Foo: {},
            },
            data: () => ({ foo: 'bar' }),
            methods: {
              foo: () => {},
            },
            mixins: [{}],
            render: () => {},
            watch: {
              foo: () => {},
            },
          }
          </script>
        `,
      })
      await execaCommand('nuxt build')
    },
    'spread operator': async () => {
      await outputFiles({
        'nuxt.config.js': "export default { modules: ['../src/index.js'] }",
        'pages/index.vue': endent`
          <script>
          export default {
            ...{ foo: 'bar' },
          }
          </script>
        `,
      })
      await execaCommand('nuxt build')
    },
    subroutes: async () => {
      await outputFiles({
        'nuxt.config.js': endent`
          import expect from '${packageName`expect`}'
          import pick from 'lodash/pick'
          import P from 'path'

          export default {
            modules: [
              '../src/index.js',
              (options, nuxt) => nuxt.hook('pages:extend', routes => {
                const removePaths = _routes => _routes.map(route => ({
                  ...route,
                  file: P.relative(process.cwd(), route.file),
                  children: removePaths(route.children),
                }))
                routes = removePaths(routes)
      
                expect(routes).toEqual([
                  {
                    children: [
                      {
                        children: [
                          {
                            children: [],
                            file: P.join('pages', 'foo', 'bar', 'index.vue'),
                            meta: { fooBarIndex: true },
                            name: 'foo-bar',
                            path: '',
                          },
                        ],
                        file: P.join('pages', 'foo', 'bar.vue'),
                        meta: { fooBar: true },
                        path: 'bar',
                      },
                      {
                        children: [],
                        file: P.join('pages', 'foo', 'index.vue'),
                        meta: { fooIndex: true },
                        name: 'foo',
                        path: '',
                      },
                    ],
                    file: P.join('pages', 'foo.vue'),
                    meta: { foo: true },
                    path: '/foo',
                  },
                ])
              })
            ],
          }
        `,
        pages: {
          foo: {
            'bar.vue': endent`
              <template>
                <div />
              </template>

              <script>
              export default {
                meta: {
                  fooBar: true,
                },
              }
              </script>
            `,
            'bar/index.vue': endent`
              <template>
                <div />
              </template>

              <script>
              export default {
                meta: {
                  fooBarIndex: true,
                },
              }
              </script>
            `,
            'index.vue': endent`
              <template>
                <div />
              </template>

              <script>
              export default {
                meta: {
                  fooIndex: true,
                },
              }
              </script>
            `,
          },
          'foo.vue': endent`
            <template>
              <div />
            </template>

            <script>
            export default {
              meta: {
                foo: true,
              },
            }
            </script>
          `,
        },
      })
      await execaCommand('nuxt build')
    },
    'typescript: composition': async () => {
      await outputFiles({
        'nuxt.config.js': endent`
          import expect from '${packageName`expect`}'

          export default {
            modules: [
              '../src/index.js',
              (options, nuxt) => nuxt.hook('pages:extend', routes => expect(routes[0].meta).toEqual({ foo: true })),
            ],
          }
        `,
        'pages/index.vue': endent`
          <template>
            <div />
          </template>

          <script setup lang="ts">
          const foo: number = 1
          definePageMeta({
            foo: true,
          })
          </script>
        `,
      })
      await execaCommand('nuxt build')
    },
    'typescript: defineComponent': async () => {
      await outputFiles({
        'nuxt.config.js': endent`
          import expect from '${packageName`expect`}'

          export default {
            modules: [
              '../src/index.js',
              (options, nuxt) => nuxt.hook('pages:extend', routes => expect(routes[0].meta).toEqual({ foo: true })),
            ],
          }
        `,
        'pages/index.vue': endent`
          <template>
            <div />
          </template>

          <script lang="ts">
          const foo: number = 1
          export default defineComponent({
            meta: {
              foo: true,
            },
          })
          </script>
        `,
      })
      await execaCommand('nuxt build')
    },
    'typescript: plain object': async () => {
      await outputFiles({
        'nuxt.config.js': endent`
          import expect from '${packageName`expect`}'

          export default {
            modules: [
              '../src/index.js',
              (options, nuxt) => nuxt.hook('pages:extend', routes => expect(routes[0].meta).toEqual({ foo: true, bar: true }))
            ],
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
            meta: {
              bar: true,
            },
          }
          </script>
        `,
      })
      await execaCommand('nuxt build')
    },
  },
  [testerPluginTmpDir()],
)
