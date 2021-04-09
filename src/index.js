import * as babel from '@babel/core'
import traverse from '@babel/traverse'
import { forEach, omit, pick } from '@dword-design/functions'
import astToLiteral from 'ast-to-literal'
import { readFileSync } from 'fs-extra'

export default function () {
  const extractMeta = filename => {
    const vueTemplateCompiler = require('vue-template-compiler')

    const Component = vueTemplateCompiler.parseComponent(
      readFileSync(filename, 'utf8')
    )
    let data = {}
    if (Component.script?.content) {
      const ast = babel.parseSync(Component.script.content, {
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
