import * as babel from '@babel/core'
import traverse from '@babel/traverse'
import {
  filter,
  find,
  forEach,
  keyBy,
  mapValues,
} from '@dword-design/functions'
import { readFileSync } from 'fs-extra'

export default function (moduleOptions) {
  const options = {
    additionalProperties: [],
    ...this.options.routeMeta,
    ...moduleOptions,
  }
  const extractMeta = filename => {
    const vueTemplateCompiler = require('vue-template-compiler')
    const Component = vueTemplateCompiler.parseComponent(
      readFileSync(filename, 'utf8')
    )
    let data = {}
    if (Component.script?.content) {
      const ast = babel.parseSync(Component.script.content, { filename })
      traverse(ast, {
        ExportDefaultDeclaration: path => {
          const metaProperty =
            path.node.declaration.properties
            |> find(
              property =>
                property.type === 'ObjectProperty' &&
                property.key.name === 'meta'
            )
          data =
            [
              ...(path.node.declaration.properties
                |> filter(
                  property =>
                    property.type === 'ObjectProperty' &&
                    property.key.name !== 'meta' &&
                    options.additionalProperties.includes(property.key.name)
                )),
              ...(metaProperty ? metaProperty.value.properties : []),
            ]
            |> filter('key.name')
            |> keyBy('key.name')
            |> mapValues('value.value')
        },
      })
    }
    return data
  }
  this.extendRoutes(routes =>
    forEach(routes, route => (route.meta = route.component |> extractMeta))
  )
}
