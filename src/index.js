import * as babel from '@babel/core'
import traverse from '@babel/traverse'
import { filter, forIn, keyBy, mapValues, pick } from '@dword-design/functions'
import { readFileSync } from 'fs-extra'

const extractMeta = options => filename => {
  const vueTemplateCompiler = require('vue-template-compiler')
  const Component = vueTemplateCompiler.parseComponent(
    readFileSync(filename, 'utf8')
  )
  let data = {}
  if (Component.script?.content) {
    const ast = babel.parseSync(Component.script.content, { filename })
    traverse(ast, {
      ExportDefaultDeclaration: path => {
        data =
          path.node.declaration.properties
          |> filter('key.name')
          |> keyBy('key.name')
          |> pick(options.properties)
          |> mapValues('value.value')
      },
    })
  }
  if ('meta' in data) {
    Object.assign(data, data.meta)
    delete data.meta
  }
  return data
}

export default function (moduleOptions) {
  const options = {
    additionalProperties: [],
    ...this.options.routeMeta,
    ...moduleOptions,
  }
  const properties = ['meta', ...options.additionalProperties]
  this.extendRoutes(routes =>
    forIn(
      route => (route.meta = route.component |> extractMeta({ properties }))
    )(routes)
  )
}
