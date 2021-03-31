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
</p>
<!-- /BADGES -->

<!-- DESCRIPTION/ -->
Adds page meta data to Nuxt route objects at build time.
<!-- /DESCRIPTION -->

Nuxt pages have a `meta` property that allows to define metadata. These can be accessed in middlewares or inside the page component at runtime.

What does not work however is to access the metadata at build time in the routes object itself. This is needed when postprocessing routes via [extendRoutes](https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-router) or the [@nuxtjs/sitemap](https://www.npmjs.com/package/@nuxtjs/sitemap) module. This module fills this gap by parsing the page files from routes and extracting the meta data from them. It is also possible to add additional properties.

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
## Contribute

Are you missing something or want to contribute? Feel free to file an [issue](https://github.com/dword-design/nuxt-route-meta/issues) or a [pull request](https://github.com/dword-design/nuxt-route-meta/pulls)! ⚙️

## Support

Hey, I am Sebastian Landwehr, a freelance web developer, and I love developing web apps and open source packages. If you want to support me so that I can keep packages up to date and build more helpful tools, you can donate here:

<p>
  <a href="https://www.buymeacoffee.com/dword">
    <img
      src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg"
      alt="Buy Me a Coffee"
      height="32"
    >
  </a>&nbsp;If you want to send me a one time donation. The coffee is pretty good 😊.<br/>
  <a href="https://paypal.me/SebastianLandwehr">
    <img
      src="https://dword-design.de/images/paypal.svg"
      alt="PayPal"
      height="32"
    >
  </a>&nbsp;Also for one time donations if you like PayPal.<br/>
  <a href="https://www.patreon.com/dworddesign">
    <img
      src="https://dword-design.de/images/patreon.svg"
      alt="Patreon"
      height="32"
    >
  </a>&nbsp;Here you can support me regularly, which is great so I can steadily work on projects.
</p>

Thanks a lot for your support! ❤️

## License

[MIT License](https://opensource.org/licenses/MIT) © [Sebastian Landwehr](https://dword-design.de)
<!-- /LICENSE -->
