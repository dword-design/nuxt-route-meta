import * as babel from '@babel/core'
import traverse from '@babel/traverse'
import {
  filter,
  forEach,
  fromPairs,
  keys,
  map,
  omit,
  pick,
  some,
} from '@dword-design/functions'
import astToLiteral from 'ast-to-literal'
import { readFileSync } from 'fs-extra'
import P from 'path'

const predefinedProperties = {
  computed: true,
  data: true,
  methods: true,
  mixins: true,
  render: true,
  watch: true,
}

export default function () {
  const extractMeta = filename => {
    const fileContent = readFileSync(filename, 'utf8')
    let data = {}

    const Component =
      P.extname(filename) === '.vue'
        ? (() => {
            const vueTemplateCompiler = require('vue-template-compiler')

            return vueTemplateCompiler.parseComponent(fileContent)
          })()
        : { script: { content: fileContent, lang: 'js' } }

    const scriptContent = Component.script?.content
    if (scriptContent) {
      if (Component.script.lang === 'ts') {
        const ts = require('typescript')

        const tsAstToLiteral = require('ts-ast-to-literal')

        const rootNode = ts.createSourceFile(
          'x.ts',
          scriptContent,
          ts.ScriptTarget.Latest
        )
        ts.forEachChild(rootNode, node => {
          switch (node.kind) {
            case ts.SyntaxKind.ExportAssignment: {
              const object =
                node.expression.kind === ts.SyntaxKind.CallExpression &&
                ((node.expression.expression.kind ===
                  ts.SyntaxKind.PropertyAccessExpression &&
                  node.expression.expression.expression.escapedText === 'Vue' &&
                  node.expression.expression.name.escapedText === 'extend' &&
                  node.expression.arguments.length === 1) ||
                  (node.expression.expression.kind ===
                    ts.SyntaxKind.Identifier &&
                    node.expression.expression.escapedText ===
                      'defineComponent'))
                  ? node.expression.arguments[0]
                  : node.expression
              data = object |> tsAstToLiteral
              break
            }
            case ts.SyntaxKind.ClassDeclaration: {
              if (
                (node.modifiers || []
                  |> some(
                    modifier => modifier.kind === ts.SyntaxKind.ExportKeyword
                  )) &&
                (node.modifiers || []
                  |> some(
                    modifier => modifier.kind === ts.SyntaxKind.DefaultKeyword
                  )) &&
                (node.heritageClauses || []
                  |> some(
                    clause =>
                      clause.types
                      |> some(type => type.expression.escapedText === 'Vue')
                  ))
              ) {
                data =
                  node.members
                  |> filter(member => member.initializer !== undefined)
                  |> map(member => [
                    member.name.escapedText,
                    member.initializer |> tsAstToLiteral,
                  ])
                  |> fromPairs
              }
              break
            }
            default:
          }
        })
      } else {
        const ast = babel.parseSync(scriptContent, {
          filename,
          ...(this.options.build.babel |> pick(['configFile', 'babelrc'])),
          ...(!this.options.build.babel.configFile &&
            !this.options.build.babel.babelrc && {
              extends: '@nuxt/babel-preset-app',
            }),
        })
        traverse(ast, {
          ExportDefaultDeclaration: path => {
            data = path.node.declaration |> astToLiteral
          },
        })
      }
    }

    return {
      ...(data |> omit(['meta', ...(predefinedProperties |> keys)])),
      ...data.meta,
    }
  }
  this.extendRoutes(routes =>
    forEach(routes, route => (route.meta = route.component |> extractMeta))
  )
}
