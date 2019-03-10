/**
 * @module test_mmm
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2019.03.10 18:47
 * @version 2019.03.10 18:47
 */

modules.define('test', [
  'i-bem-dom',
  // 'config',
],
  // 'vow',
function define(provide,
  bemDom,
  // config,
test) {
  // vow,

  /**
   * @exports
   * @class test_mmm
   * @bem
   */
  var _test_mmm_proto = /** @lends test_mmm_prototype */ {

    // /** _getDefaultParams ** {{{ */
    // _getDefaultParams: function() {
    //   // var params = this.__base(); // NOTE: For `Object.assign`
    //   return {
    //
    //     // paramName: 'value',
    //
    //   };
    // },/*}}}*/
    //
    // /** _test_mmm_init ** {{{ Module init... */
    // _test_mmm_init: function() {
    // },/*}}}*/
    //
    // /** onSetMod ** {{{ Modifiers... */
    // onSetMod: {
    //
    //   /** js ** {{{ JS lifecycle... */
    //   js: {
    //     inited: function() {
    //       this.__base.apply(this, arguments);
    //       this._test_mmm_init && this._test_mmm_init();
    //     },
    //   },/*}}}*/
    //
    // },/*}}}*/

  };

  // /** _test_mmm_static ** {{{ Static properties... */
  // var _test_mmm_static = /** @lends test_mmm */ {
  //
  //   // lazyInit : true,
  //
  //   /** onInit ** {{{ Static init...
  //    */
  //   onInit: function() {
  //
  //     // var proto = this.prototype;
  //     // this._events({ block : Button, modName : 'action', modVal : 'itemClose' }).on('click', proto.onItemCloseButtonClick);
  //
  //     return this.__base.apply(this, arguments);
  //
  //   }/*}}}*/
  //
  // };/*}}}*/

  // Provide block modifier
  provide(test.declMod({modName: 'mmm', modVal: true}, _test_mmm_proto));

}); // Module end
