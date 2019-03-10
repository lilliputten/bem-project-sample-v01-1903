/* eslint-env commonjs */
/**
 * @module helpers__objects
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2018.11.02 05:21
 * @version 2018.11.02 05:21
 */

(function(){

  var isArray = Array.isArray;

  var _export = /** @lends helpers__objects.prototype */ {

    /** isEqualsOrIncludes ** {{{ Is first value equal or contained in second (if second is array)
     * @param {Number|String|Boolean} v1
     * @param {Number|String|Boolean|Array} v2
     * @return {Boolean}
     */
    isEqualsOrIncludes: function(v1, v2){

      if (isArray(v2)) {
        return v2.includes(v1);
      }
      else {
        return v2 == v1;
      }

    },/*}}}*/

    /** checkConditions ** {{{ TODO...
     * @param value
     * @param conditions
     * @return {Boolean}
     */
    checkConditions: function(value, conditions){
      if (conditions === 'inverted') {
        return !value;
      }
      return !!value;
    },/*}}}*/

  };

  /** Universal export... ** {{{ */
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = _export;
  }/*}}}*/
  /** YM export... ** {{{ */
  if (typeof modules === 'object' && typeof modules.define === 'function') {
    modules.define('helpers__objects', [], function(provide) {
      provide(_export);
    });
  }/*}}}*/

})();
