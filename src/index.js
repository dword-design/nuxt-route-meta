import * as babel from '@babel/core'
import traverse from '@babel/traverse'
import { forEach, omit, pick } from '@dword-design/functions'
import astToLiteral from 'ast-to-literal'
import { readFileSync } from 'fs-extra'
import P from 'path'

export default function () {
  const extractMeta = filename => {
    const fileContent = readFileSync(filename, 'utf8')

    const scriptContent =
      P.extname(filename) === '.vue'
        ? (() => {
            const vueTemplateCompiler = require('vue-template-compiler')

            const Component = vueTemplateCompiler.parseComponent(fileContent)

            return Component.script?.content
          })()
        : fileContent
    let data = {}
    if (scriptContent) {
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

    return {
      ...(data |> omit(['meta'])),
      ...data.meta,
    }
  }
  this.extendRoutes(routes =>
    forEach(routes, route => (route.meta = route.component |> extractMeta))
  )
}
