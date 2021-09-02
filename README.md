<!-- TITLE/ -->
# nuxt-route-meta
<!-- /TITLE -->

<!-- BADGES/ -->
  <p>
    <a href="https://npmjs.org/package/nuxt-route-meta">
      <img
        src="https://img.shields.io/npm/v/nuxt-route-meta.svg"
        alt="npm version"
      >
    </a><img src="https://img.shields.io/badge/os-linux%20%7C%C2%A0macos%20%7C%C2%A0windows-blue" alt="Linux macOS Windows compatible"><a href="https://github.com/dword-design/nuxt-route-meta/actions">
      <img
        src="https://github.com/dword-design/nuxt-route-meta/workflows/build/badge.svg"
        alt="Build status"
      >
    </a><a href="https://codecov.io/gh/dword-design/nuxt-route-meta">
      <img
        src="https://codecov.io/gh/dword-design/nuxt-route-meta/branch/master/graph/badge.svg"
        alt="Coverage status"
      >
    </a><a href="https://david-dm.org/dword-design/nuxt-route-meta">
      <img src="https://img.shields.io/david/dword-design/nuxt-route-meta" alt="Dependency status">
    </a><img src="https://img.shields.io/badge/renovate-enabled-brightgreen" alt="Renovate enabled"><br/><a href="https://gitpod.io/#https://github.com/dword-design/nuxt-route-meta">
      <img
        src="https://gitpod.io/button/open-in-gitpod.svg"
        alt="Open in Gitpod"
        width="114"
      >
    </a><a href="https://www.buymeacoffee.com/dword">
      <img
        src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg"
        alt="Buy Me a Coffee"
        width="114"
      >
    </a><a href="https://paypal.me/SebastianLandwehr">
      <img
        src="https://sebastianlandwehr.com/images/paypal.svg"
        alt="PayPal"
        width="163"
      >
    </a><a href="https://www.patreon.com/dworddesign">
      <img
        src="https://sebastianlandwehr.com/images/patreon.svg"
        alt="Patreon"
        width="163"
      >
    </a>
</p>
<!-- /BADGES -->

<!-- DESCRIPTION/ -->
Adds Nuxt page data to route meta at build time. Also supports TypeScript.
<!-- /DESCRIPTION -->

Nuxt pages have a `meta` property that allows to define meta data. These can be accessed in middlewares via `route.meta` at runtime. What does not work however is to access the meta data at build time in the routes object itself. This is needed when postprocessing routes via [extendRoutes](https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-router) or the [@nuxtjs/sitemap](https://www.npmjs.com/package/@nuxtjs/sitemap) module. This module fills this gap by parsing the page files, extracting the meta data, and writing them to the `meta` field of each route corresponding to the page.

ℹ️ **Note that this module can only extract static data from the pages at build time. It will not work with dynamic data depending on `this`. In case you have an idea how to improve that, feel free to open up an issue or pull request.**

<!-- INSTALL/ -->
## Install

```bash
# npm
$ npm install nuxt-route-meta

# Yarn
$ yarn add nuxt-route-meta
```
<!-- /INSTALL -->

## Usage

Add the module to your `nuxt.config.js`:

```js
export default {
  modules: [
    'nuxt-route-meta',
  ]
}
```

Add some properties to your pages:

```html
<template>
  <div>Hello world</div>
</template>
```

```js
<script>
export default {
  auth: true,
  meta: {
    theme: 'water',
  },
}
</script>
```

That's it! Now you can access the meta data in `route.meta` from anywhere as you know it from [vue-router](https://www.npmjs.com/package/vue-router). The module takes all properties that all properties that are not functions, and the meta property itself is merged into the result. So `route.meta` from the example above is `{ auth: true, theme: 'water' }`.

Here is an example to use it inside `this.extendRoutes` in a module:

```js
export default function () {
  this.extendRoutes(routes =>
    routes.forEach(route => {
      if (route.meta.auth) {
        // do something with auth routes
      }
    })
  )
}
```

## TypeScript

The module has built-in support for TypeScript. Requirement is that the TypeScript module is installed as described in [the Nuxt TypeScript docs](https://typescript.nuxtjs.org/guide/setup).

```js
<script lang="ts">
import Vue from 'vue'

export default class MyComponent extends Vue {
  meta = {
    foo: true,
  },
}
</script>
```

## Supported APIs

### Plain object

```js
<script>
export default {
  auth: true,
  meta: {
    theme: 'water',
  },
}
</script>
```

This API does not make much sense with TypeScript because you do not have type information in the components.

### Options API

```js
<script>
import Vue from 'vue'

export default class MyComponent extends Vue {
  meta = {
    foo: true,
  },
}
</script>
```

As of writing this, Nuxt with TypeScript does not seem to support the options API with Nuxt-specific properties like `asyncData`, `fetch`, `meta`, etc. In case this changes, open up an issue.

### Class API

```js
<script>
import Vue from 'vue'

export default class MyComponent extends Vue {
  meta = {
    foo: true,
  },
}
</script>
```

### Property decorator

Plain JavaScript: Install [nuxt-property-decorator](https://github.com/nuxt-community/nuxt-property-decorator).

```js
<script>
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class MyComponent extends Vue {
  meta = {
    foo: true,
  },
}
</script>
```

TypeScript:

```js
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class MyComponent extends Vue {
  meta = {
    foo: true,
  },
}
</script>
```

## Composition API

This package ships with support for the Vue composition API. When setting up your nuxt project, make sure to follow the [`@nuxtjs/composition-api` guide](https://composition-api.nuxtjs.org/getting-started/setup) closely.

```js
<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  meta: {
    auth: true,
  },
})
</script>
```

<!-- LICENSE/ -->
## Contribute

Are you missing something or want to contribute? Feel free to file an [issue](https://github.com/dword-design/nuxt-route-meta/issues) or a [pull request](https://github.com/dword-design/nuxt-route-meta/pulls)! ⚙️

## Support

Hey, I am Sebastian Landwehr, a freelance web developer, and I love developing web apps and open source packages. If you want to support me so that I can keep packages up to date and build more helpful tools, you can donate here:

<p>
  <a href="https://www.buymeacoffee.com/dword">
    <img
      src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg"
      alt="Buy Me a Coffee"
      width="114"
    >
  </a>&nbsp;If you want to send me a one time donation. The coffee is pretty good 😊.<br/>
  <a href="https://paypal.me/SebastianLandwehr">
    <img
      src="https://sebastianlandwehr.com/images/paypal.svg"
      alt="PayPal"
      width="163"
    >
  </a>&nbsp;Also for one time donations if you like PayPal.<br/>
  <a href="https://www.patreon.com/dworddesign">
    <img
      src="https://sebastianlandwehr.com/images/patreon.svg"
      alt="Patreon"
      width="163"
    >
  </a>&nbsp;Here you can support me regularly, which is great so I can steadily work on projects.
</p>

Thanks a lot for your support! ❤️

## See also

* [nuxt-mail](https://github.com/dword-design/nuxt-mail): Adds email sending capability to a Nuxt.js app. Adds a server route, an injected variable, and uses nodemailer to send emails.
* [nuxt-modernizr](https://github.com/dword-design/nuxt-modernizr): Adds a Modernizr build to your Nuxt.js app.
* [nuxt-mermaid-string](https://github.com/dword-design/nuxt-mermaid-string): Embed a Mermaid diagram in a Nuxt.js app by providing its diagram string.
* [nuxt-content-git](https://github.com/dword-design/nuxt-content-git): Additional module for @nuxt/content that replaces or adds createdAt and updatedAt dates based on the git history.
* [nuxt-babel-runtime](https://github.com/dword-design/nuxt-babel-runtime): Nuxt CLI that supports babel. Inspired by @nuxt/typescript-runtime.

## License

[MIT License](https://opensource.org/licenses/MIT) © [Sebastian Landwehr](https://sebastianlandwehr.com)
<!-- /LICENSE -->
