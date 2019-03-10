/* eslint-env es6, node, commonjs */
module.exports = {

  // Use bemhtml templates & BEMHTML on client
  useBemhtml: true,

  bundleName: '.bundle',
  pagesSrcPath: 'pages',
  bundlePagesSrcPath: 'bundle-pages',

  verbose: false,
  // verbose: true,
  // verbose: 'included',

  include: [
    'blocks/base/page/page.css',
  ],
  exclude: [
    // /blocks\/layout\/page\/page\.\w+$/,
    // 'blocks/layout/page',
    'ua.bemhtml',
    'blocks/core/App/App.bemhtml',
    'blocks/layout/Header/Header.bemhtml',
    'blocks/layout/Footer/Footer.bemhtml',
    'blocks/layout/Content/Content.bemhtml',
    '.blocks/page/', // bem-components
    'blocks/make-time/',
    // /blocks\/common\/test\/test\.js$/,
  ],

  overrideBundlePages: {
    include: [
      // 'blocks/make-bundle/',
      /blocks\/make-bundle\/.*\.(css|js)$/,
    ],
    exclude: [
      'blocks/',
    ],
  },

};
