import * as babel from '@babel/core'
import traverse from '@babel/traverse'
import {
  filter,
  fromPairs,
  keys,
  map,
  omit,
  pick,
  some,
} from '@dword-design/functions'
import astToLiteral from 'ast-to-literal'
import fs from 'fs-extra'
import P from 'path'
import tsAstToLiteral from 'ts-ast-to-literal'
import ts from 'typescript'
import vueTemplateCompiler from 'vue-template-compiler'

const predefinedProperties = {
  components: true,
  computed: true,
  data: true,
  methods: true,
  mixins: true,
  render: true,
  watch: true,
}

export default function () {
  const extractMeta = filename => {
    const fileContent = fs.readFileSync(filename, 'utf8')
    let data = {}

    const Component =
      P.extname(filename) === '.vue'
        ? vueTemplateCompiler.parseComponent(fileContent)
        : { script: { content: fileContent, lang: 'js' } }

    const scriptContent = Component.script?.content
    if (scriptContent) {
      if (Component.script.lang === 'ts') {
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
        traverse.default(ast, {
          ClassDeclaration: path => {
            if (path.node.superClass.name === 'Vue') {
              data =
                path.node.body.body
                |> map(property => [
                  property.key.name,
                  property.value |> astToLiteral,
                ])
                |> fromPairs
            }
          },
          ExportDefaultDeclaration: path => {
            const object =
              path.node.declaration.type === 'CallExpression' &&
              (path.node.declaration.callee.name === 'defineComponent' ||
                (path.node.declaration.callee.object?.name === 'Vue' &&
                  path.node.declaration.callee.property?.name === 'extend'))
                ? path.node.declaration.arguments[0]
                : path.node.declaration
            data = object |> astToLiteral
          },
        })
      }
    }

    return {
      ...(data |> omit(['meta', ...(predefinedProperties |> keys)])),
      ...data?.meta,
    }
  }

  const parseRoutes = routes => {
    for (const route of routes) {
      route.meta = route.component |> extractMeta
      if (route.children !== undefined) {
        parseRoutes(route.children)
      }
    }
  }
  this.extendRoutes(parseRoutes)
}
