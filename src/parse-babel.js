import * as babel from '@babel/core'
import traverse from '@babel/traverse'
import astToLiteral from 'ast-to-literal'
import deepmerge from 'deepmerge'
import { keys, omit } from 'lodash-es'

import predefinedProperties from './predefined-properties.js'

export default (script, context = {}) => {
  const ast = babel.parseSync(script.content, { filename: context.filename })
  let data = {}
  if (script.setup) {
    traverse.default(ast, {
      CallExpression: path => {
        if (path.node.callee.name === 'definePageMeta') {
          data = astToLiteral(path.node.arguments[0])
        }
      },
    })
  } else {
    traverse.default(ast, {
      ClassDeclaration: path => {
        if (path.node.superClass.name === 'Vue') {
          data = Object.fromEntries(
            path.node.body.body.map(property => [
              property.key.name,
              astToLiteral(property.value),
            ]),
          )
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
        data = astToLiteral(object)
      },
    })
    data = deepmerge(
      omit(data, ['meta', ...keys(predefinedProperties)]),
      data?.meta || {},
    )
  }

  return data
}
