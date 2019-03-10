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

  // var __global = typeof global !== 'undefined' ? global : typeof module !== 'undefined' ? module : typeof window !== 'undefined' ? window : this;

  // Variable to store config module
  var config;

  /** Universal export... ** {{{ */
  if (typeof module === 'object' && typeof module.exports === 'object') {

    config = require('../../base/config/config.js');

    Object.assign(config, {
      make: require('./__make/config__make.js'),
    });

    // Export to globals
    __global.config = config;

    // Export
    module.exports = config;

  }/*}}}*/
  /** YM export... ** {{{ */
  if (typeof modules === 'object' && typeof modules.define === 'function') {

    modules.define('config', [
      'config__make',
    ], function(provide,
      configMake,
    __BASE) {

      config = Object.assign(__BASE, {
        make: configMake,
      });

      // Export to globals
      __global.config = config;

      // Export
      provide(config);

    });
  }/*}}}*/

})(typeof global !== 'undefined' ? global : typeof module !== 'undefined' ? module : typeof window !== 'undefined' ? window : this);

