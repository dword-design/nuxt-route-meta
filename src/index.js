import { parse as parseVue } from '@vue/compiler-sfc'
import deepmerge from 'deepmerge'
import fs from 'fs-extra'
import P from 'path'

import parseBabel from './parse-babel.js'
import parseTypescript from './parse-typescript.js'

export default (options, nuxt) => {
  const extractMeta = filename => {
    const fileContent = fs.readFileSync(filename, 'utf8')

    const Component =
      P.extname(filename) === '.vue'
        ? parseVue(fileContent)
        : { descriptor: { script: { content: fileContent, lang: 'js' } } }

    const data = ['script', 'scriptSetup']
      .filter(name => Component.descriptor[name])
      .map(name =>
        (Component.descriptor[name].lang === 'ts'
          ? parseTypescript
          : parseBabel)(Component.descriptor[name], {
          filename,
          nuxt,
        }),
      )

    return deepmerge.all(data)
  }

  const parseRoutes = routes => {
    for (const route of routes) {
      route.meta = {
        ...route.meta,
        ...extractMeta(route.file),
      }
      if (route.children.length > 0) {
        parseRoutes(route.children)
      }
    }
  }
  nuxt.hook('pages:extend', parseRoutes)
}
