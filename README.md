<!-- TITLE/ -->
# nuxt-route-meta
<!-- /TITLE -->

<!-- BADGES/ -->
[![NPM version](https://img.shields.io/npm/v/nuxt-route-meta.svg)](https://npmjs.org/package/nuxt-route-meta)
![Linux macOS Windows compatible](https://img.shields.io/badge/os-linux%20%7C%C2%A0macos%20%7C%C2%A0windows-blue)
[![Build status](https://github.com/dword-design/nuxt-route-meta/workflows/build/badge.svg)](https://github.com/dword-design/nuxt-route-meta/actions)
[![Coverage status](https://img.shields.io/coveralls/dword-design/nuxt-route-meta)](https://coveralls.io/github/dword-design/nuxt-route-meta)
[![Dependency status](https://img.shields.io/david/dword-design/nuxt-route-meta)](https://david-dm.org/dword-design/nuxt-route-meta)
![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen)

<a href="https://gitpod.io/#https://github.com/dword-design/bar">
  <img src="https://gitpod.io/button/open-in-gitpod.svg" alt="Open in Gitpod">
</a><a href="https://www.buymeacoffee.com/dword">
  <img
    src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg"
    alt="Buy Me a Coffee"
    height="32"
  >
</a><a href="https://paypal.me/SebastianLandwehr">
  <img
    src="https://dword-design.de/images/paypal.svg"
    alt="PayPal"
    height="32"
  >
</a><a href="https://www.patreon.com/dworddesign">
  <img
    src="https://dword-design.de/images/patreon.svg"
    alt="Patreon"
    height="32"
  >
</a>
<!-- /BADGES -->

<!-- DESCRIPTION/ -->
Adds page meta data to Nuxt route objects at build time.
<!-- /DESCRIPTION -->

Nuxt pages have a `meta` property that allows to define metadata. These can be accessed in middlewares or inside the page component at runtime.

What does not work however is to access the metadata at build time in the routes object itself. This is needed when postprocessing routes via [extendRoutes](https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-router) or the [@nuxtjs/sitemap](https://www.npmjs.com/package/@nuxtjs/sitemap) module. This module fills this gap by parsing the page files from routes and extracting the meta data from them. It is also possible to add additional properties.

<!-- INSTALL/ -->
## Install

```bash
# NPM
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

That's it! Now you can access `route.meta` from anywhere as you know it from [vue-router](https://www.npmjs.com/package/vue-router).

## Configuration

The default configuration copies the `meta` property of pages to the `meta` property of routes. There are however some Nuxt modules that make use of other properties, for example `auth` from [@nuxtjs/auth](https://www.npmjs.com/package/@nuxtjs/auth). It is possible to add these properties via configuration. Note that these properties are also added to `route.meta`. So `auth` can be accessed from `route.meta.auth`.

```js
export default {
  modules: [
    ['nuxt-route-meta', {
      additionalProperties: ['auth'],
    }],
  ],
  // or via the top-level option:
  routeMeta: {
    additionalProperties: ['auth'],
  },
}
```

<!-- LICENSE/ -->
## License

Unless stated otherwise all works are:

Copyright &copy; Sebastian Landwehr <info@dword-design.de>

and licensed under:

[MIT License](https://opensource.org/licenses/MIT)
<!-- /LICENSE -->
