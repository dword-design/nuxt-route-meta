import deepmerge from 'deepmerge'
import { keys, omit } from 'lodash-es'
import tsAstToLiteral from 'ts-ast-to-literal'
import ts from 'typescript'

import predefinedProperties from './predefined-properties.js'

export default script => {
  const rootNode = ts.createSourceFile(
    'x.ts',
    script.content,
    ts.ScriptTarget.Latest,
  )
  let data = {}
  if (script.setup) {
    ts.forEachChild(rootNode, node => {
      switch (node.kind) {
        case ts.SyntaxKind.ExpressionStatement: {
          if (
            node.expression.kind === ts.SyntaxKind.CallExpression &&
            node.expression.expression.escapedText === 'definePageMeta'
          ) {
            data = tsAstToLiteral(node.expression.arguments[0])
          }
          break
        }
        default:
      }
    })
  } else {
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
              (node.expression.expression.kind === ts.SyntaxKind.Identifier &&
                node.expression.expression.escapedText === 'defineComponent'))
              ? node.expression.arguments[0]
              : node.expression
          data = tsAstToLiteral(object)
          break
        }
        case ts.SyntaxKind.ClassDeclaration: {
          if (
            (node.modifiers || []).some(
              modifier => modifier.kind === ts.SyntaxKind.ExportKeyword,
            ) &&
            (node.modifiers || []).some(
              modifier => modifier.kind === ts.SyntaxKind.DefaultKeyword,
            ) &&
            (node.heritageClauses || []).some(clause =>
              clause.types.some(type => type.expression.escapedText === 'Vue'),
            )
          ) {
            data = Object.fromEntries(
              node.members
                .filter(member => member.initializer !== undefined)
                .map(member => [
                  member.name.escapedText,
                  tsAstToLiteral(member.initializer),
                ]),
            )
          }
          break
        }
        default:
      }
    })
    data = deepmerge(
      omit(data, ['meta', ...keys(predefinedProperties)]),
      data.meta || {},
    )
  }

  return data
}
