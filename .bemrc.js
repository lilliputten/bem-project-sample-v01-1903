/* eslint-env es6, node, commonjs */
module.exports = {

  root: true,

  levels: {
    'blocks/libs': { scheme : 'nested' },
    'blocks/base': { scheme : 'nested' },
    'blocks/core': { scheme : 'nested' },
    // 'blocks/components': { scheme : 'nested' },
    // 'blocks/forms': { scheme : 'nested' },
    // 'blocks/layout': { scheme : 'nested' },
    // 'blocks/interface': { scheme : 'nested' },
    // 'blocks/questionnaire': { scheme : 'nested' },
    'blocks/demo': { scheme : 'nested' }, // demo blocks
    // 'blocks/make-bundle': { scheme : 'nested' },
    'blocks/make-time': { scheme : 'nested' }, // make-time (excluded from bundle!)
  },

  // sets: {
  //   desktop: 'common desktop',
  //   touch: 'common touch',
  // },

  modules: {
    'bem-tools': {
      plugins: {
        create: {
          templates: {
            'bemjson': '.bem/templates/bemjson.js',
            js: '.bem/templates/js.js',
            css: '.bem/templates/css.js',
            bemhtml: '.bem/templates/bemhtml.js',
            'deps.js': '.bem/templates/deps.js',
          },
          techs: [
            'js',
            'css',
            'bemhtml',
            'deps.js',
          ],
          levels: {
            'pages': {
              techs: [
                'bemjson',
              ],
            },
            'blocks/demo': {
              default: true,
            },
          },
        },
      },
    },
  },

};
