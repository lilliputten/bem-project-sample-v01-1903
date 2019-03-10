/* eslint-env commonjs */
/**
 * @module config__make
 * @description Make-time definitions (not exists in production runtime!)
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2018.09.26, 23:11
 * @version 2018.09.26, 23:11
 */

(function(){

  var _moduleName = 'config__make';

  var _export = /** @lends config__make.prototype */ {

    makeName: 'Site Name',

  };

  /** Universal export... ** {{{ */
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = _export;
  }/*}}}*/
  /** YM export... ** {{{ */
  if (typeof modules === 'object' && typeof modules.define === 'function') {
    modules.define(_moduleName, [], function(provide) {
      provide(_export);
    });
  }/*}}}*/

})();
