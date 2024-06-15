import { isNuxt3 as isNuxt3Try } from '@nuxt/kit'
import { parse as parseVue } from '@vue/compiler-sfc'
import deepmerge from 'deepmerge'
import fs from 'fs-extra'
import P from 'path'

import parseBabel from './parse-babel.js'
import parseTypescript from './parse-typescript.js'

export default function (options, nuxt) {
  nuxt = nuxt || this
  let isNuxt3 = true
  try {
    isNuxt3 = isNuxt3Try()
  } catch {
    isNuxt3 = false
  }

  const extractMeta = async filename => {
    const fileContent = fs.readFileSync(filename, 'utf8')

    const Component =
      P.extname(filename) === '.vue'
        ? parseVue(fileContent)
        : { descriptor: { script: { content: fileContent, lang: 'js' } } }

    const data = await Promise.all(
      ['script', 'scriptSetup']
        .filter(name => Component.descriptor[name])
        .map(async name =>
          (
            await (Component.descriptor[name].lang === 'ts'
              ? parseTypescript
              : parseBabel)
          )(Component.descriptor[name], {
            filename,
            nuxt,
          }),
        ),
    )

    return deepmerge.all(data)
  }

  const parseRoutes = routes =>
    Promise.all(
      routes.map(async route => {
        route.meta = {
          ...route.meta,
          ...(await extractMeta(route.file)),
        }
        if (route.children.length > 0) {
          await parseRoutes(route.children)
        }
      }),
    )

  const hookObject = isNuxt3 ? nuxt : nuxt.nuxt
  hookObject.hook('pages:extend', parseRoutes)
}
