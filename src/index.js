import * as babel from '@babel/core'
import traverse from '@babel/traverse'
import { forEach, keys, omit, pick } from '@dword-design/functions'
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
          if (node.kind === ts.SyntaxKind.ExportAssignment) {
            data = node.expression |> tsAstToLiteral
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
