/* eslint-disable -no-debugger */
/**
 * @module test
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2019.03.10 18:49
 * @version 2019.03.10 18:49
 */

modules.define('test', [
  'i-bem-dom',
],
function define(provide,
  bemDom,
// eslint-disable-next-line no-unused-vars
__BASE) {

  /**
   * @exports
   * @class test
   * @bem
   */
  var _test_proto = /* @lends test.prototype */ {

    /** _getDefaultParams ** {{{ */
    _getDefaultParams: function() {
      // var params = this.__base(); // NOTE: For `Object.assign`
      return {

        // paramName: 'value',

      };
    },/*}}}*/

    /** method1 ** {{{
     */
    method1: function() {
      console.log('test:method1', this);
      debugger;
      this.__base.apply(this, arguments);
    },/*}}}*/

    /** _test_init ** {{{ Block init...
     */
    _test_init: function() {
      console.log('test:init', bemDom, this);
      debugger;
      // this.method1();
      this.setMod('mmm');
      this.method2();
      this.delMod('mmm');
      // this.method1();
    },/*}}}*/

    /** beforeSetMod ** {{{ Modifiers... */
    beforeSetMod: {

      /** mmm ** {{{ testMode */
      mmm: {
        true: function() {
          console.log('before:setMod:mmm', this);
          debugger;
          // this.method2(); // Here is not defined yet
          this.__base.apply(this, arguments);
        },
        '': function() {
          console.log('before:delMod:mmm', this);
          debugger;
          this.__base.apply(this, arguments);
        },
      },/*}}}*/

    },/*}}}*/

    /** onSetMod ** {{{ Modifiers... */
    onSetMod: {

      /** mmm ** {{{ testMode */
      mmm: {
        true: function() {
          console.log('setMod:mmm', this);
          debugger;
          // this.method2(); // Here is already defined
          this.__base.apply(this, arguments);
        },
        '': function() {
          console.log('delMod:mmm', this);
          debugger;
          this.__base.apply(this, arguments);
        },
      },/*}}}*/

      /** js ** {{{ JS lifecycle... */
      js: {
        inited: function() {
          this.__base.apply(this, arguments);
          this._test_init && this._test_init();
        },
      },/*}}}*/

    },/*}}}*/

  };

  // /** _test_static ** {{{ Static properties... */
  // var _test_static = /** @lends test */ {
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

  // Provide block...
  provide(bemDom.declBlock(this.name, _test_proto));

}); // Module end
