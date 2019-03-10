/* eslint-env commonjs */
/**
 * @module config
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2018.09.26, 23:11
 * @version 2018.09.26, 23:11
 *
 * TODO 2018.09.27, 00:12 -- Make algorythmic eval of submodules/elems?
 *
 */

(function(__global){

  // Variable to store config module
  var config;

  /** Universal export... ** {{{ */
  if (typeof module === 'object' && typeof module.exports === 'object') {

    config = {
      css: require('./__css/config__css.js'),
      site: require('./__site/config__site.js'),
    };

    // Export to globals
    __global.config = config;

    // Export
    module.exports = config;

  }/*}}}*/
  /** YM export... ** {{{ */
  if (typeof modules === 'object' && typeof modules.define === 'function') {

    modules.define('config', [
      'config__css',
      'config__site',
    ], function(provide,
      css,
      site,
    // eslint-disable-next-line no-unused-vars
    __BASE) {

      config = /** @lends config.prototype */ {
        css : css,
        site : site,
      };

      // Export to globals
      __global.config = config;

      // Export
      provide(config);

    });
  }/*}}}*/

})(typeof global !== 'undefined' ? global : typeof module !== 'undefined' ? module : typeof window !== 'undefined' ? window : this);
