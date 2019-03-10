/* eslint-env es6, node, commonjs */
const

  Params = require('./EnvParams.js'),

  // package
  pkg = require('./package'),

  // Repack config
  repackCfg = require('./repack-config'),

  // Runtime modules...
  config = require('./blocks/make-time/config/config.js'),
  helpers = require('./blocks/base/helpers/helpers.js')

;

const Env = Params.global.Env = Object.assign({}, Params, {

  pkg,
  config,
  helpers,
  repackCfg,

  /** getPageId() ** {{{ Определение ID страницы (бандла) по его пути (имя последней папки)
   * @param {string} dirname - Имя директории модуля
   */
  getPageId : function (dirname) {
    var pageId = this.pageId = dirname.replace(/^.*[\\/](.*)$/, '$1');
    return pageId;
  },/*}}}*/

  /** page() ** {{{ Create page from bootstrap
   * @param {object} ctx
   */
  page : function(ctx) {

    ctx = ctx || {};

    const pageId = ctx.pageId || this.pageId;
    const minAssetsExt = /*DEBUG*/ true && Params.DEBUG ? '' :
      '.min';

    if (!pageId) {
      throw new Error('pageId mus be specified!');
    }

    return {

      block : 'page',
      title : ctx.title || pageId,
      favicon: config.site.favicon || '/public/favicon.ico',

      // NOTE: For mdb see [MD Bootstrap CDN](https://mdbootstrap.com/md-bootstrap-cdn/)

      /** head **
       */
      head: [

        { elem: 'meta', attrs: { name: 'description', content: '' } },
        { elem: 'meta', attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1' } },

        /** Styles... ** {{{
         */

        Params.useLocalAssets ?
          { elem: 'css', url: '/node_modules/font-awesome/css/font-awesome' + minAssetsExt + '.css' } :
          { elem: 'css', url: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' },

        Params.useBootstrap && ( Params.useLocalAssets ?
          { elem: 'css', url: '/node_modules/bootstrap/dist/css/bootstrap' + minAssetsExt + '.css' } :
          { elem: 'css', url: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.min.css' } ),

        // Params.useLocalAssets ?
        //   { elem: 'css', url: '/node_modules/mdbootstrap/css/bootstrap' + minAssetsExt + '.css' } :
        //   { elem: 'css', url: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.min.css' },

        // Params.useLocalAssets ?
        //   { elem: 'css', url: '/node_modules/mdbootstrap/css/mdb' + minAssetsExt + '.css' } :
        //   { elem: 'css', url: 'https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.5.11/css/mdb.min.css' },

        // Page css
        { elem: 'css', url: pageId + '.css' },

        /*}}}*/

      ],

      /** Scripts... ** {{{
       */
      scripts: [

        Params.useLocalAssets ?
          { elem: 'js', url: '/node_modules/es5-shim/es5-shim' + minAssetsExt + '.js' } :
          { elem: 'js', url: 'https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.12/es5-shim.min.js' },

        Params.useLocalAssets ?
          { elem: 'js', url: '/node_modules/jquery/dist/jquery' + minAssetsExt + '.js' } :
          { elem: 'js', url: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js' },

        { elem: 'js', url: '/node_modules/ym/modules' + minAssetsExt + '.js' },

        Params.useBootstrap && ( Params.useLocalAssets ?
          { elem: 'js', url: '/node_modules/bootstrap/dist/js/bootstrap' + minAssetsExt + '.js' } :
          { elem: 'js', url: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/js/bootstrap.min.js' } ),

        // Params.useLocalAssets ?
        //   { elem: 'js', url: '/node_modules/mdbootstrap/js/popper.min.js' } :
        //   { elem: 'js', url: 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.4/umd/popper.min.js' },

        // Params.useLocalAssets ?
        //   { elem: 'js', url: '/node_modules/mdbootstrap/js/bootstrap' + minAssetsExt + '.js' } :
        //   { elem: 'js', url: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/js/bootstrap.min.js' },

        // Params.useLocalAssets ?
        //   { elem: 'js', url: '/node_modules/mdbootstrap/js/mdb' + minAssetsExt + '.js' } :
        //   { elem: 'js', url: 'https://cdnjs.cloudflare.com/ajax/libs/mdbootstrap/4.5.11/js/mdb.min.js' },

        // Page scripts...
        (repackCfg.useBemhtml || ctx.useBemhtml) && { elem: 'js', url: pageId + '.bemhtml.js' }, // Include bemhtml templates only if required in config!
        { elem: 'js', url: pageId + '.browser.js' }, // Browser code

      ],/*}}}*/

      // ??? Need to pass page id?
      mods : Object.assign(
        {
          // id: pageId,
          // generated: true,
          // theme: 'islands',
        },
        // Env.project.config.appModules, // ??? // project.config.appModules,
        ctx.mods
      ),

      // js : Object.assign({
      //   id : pageId,
      // }, ctx.js),

      content: ctx.contentBlock || {
        block: 'App',
        content: ctx.content,
        // headerBlock: { elem: 'Header' },
        // contentBlock: ctx.contentBlock || { elem: 'Content', content: ctx.content },
        // footerBlock: ctx.footerBlock || { elem : 'Footer', content: ctx.footerContent },
      },

    };

  },/*}}}*/

});

module.exports = Env;
