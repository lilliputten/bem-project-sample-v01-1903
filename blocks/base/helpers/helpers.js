/* eslint-env commonjs */
/**
 * @module helpers
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2018.11.02 04:26
 * @version 2018.11.02 04:26
 */

(function(__global){

  // Variable to store helpers module
  var helpers;

  /** Universal export... ** {{{ */
  if (typeof module === 'object' && typeof module.exports === 'object') {

    helpers = {
      objects: require('./__objects/helpers__objects.js'),
    };

    // Export to globals
    __global.helpers = helpers;

    // Export
    module.exports = helpers;

  }/*}}}*/
  /** YM export... ** {{{ */
  if (typeof modules === 'object' && typeof modules.define === 'function') {

    modules.define('helpers', [
      'helpers__objects',
      'polyfills',
    ], function(provide,
      helpersObjects,
      polyfills, // eslint-disable-line no-unused-vars
    // eslint-disable-next-line no-unused-vars
    __BASE) {

      helpers = /** @lends helpers.prototype */ {
        objects: helpersObjects,
      };

      // Export to globals
      __global.helpers = helpers;

      // Export
      provide(helpers);

    });
  }/*}}}*/

})(typeof global !== 'undefined' ? global : typeof module !== 'undefined' ? module : typeof window !== 'undefined' ? window : this);
