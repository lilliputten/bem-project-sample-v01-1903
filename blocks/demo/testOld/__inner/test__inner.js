/**
 * @module test__inner
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2018.10.01 01:57
 * @version 2018.10.01 01:57
 */

modules.define('test__inner', [
  'i-bem-dom',
  // 'config',
  // 'vow',
],
function define(provide,
  bemDom,
  // config,
  // vow,
// eslint-disable-next-line no-unused-vars
__BASE) {

  /**
   * @exports
   * @class test__inner
   * @bem
   */
  var test__inner_proto = /** @lends test__inner_prototype */ {

    /** onSetMod ** {{{ Modifiers... */
    onSetMod: {

      /** js ** {{{ JS lifecycle... */
      js: {
        inited: function() {
          var x = 1;
          /*DEBUG*/console.log(x);//eslint-disable-line
          /*DEBUG*/debugger;//eslint-disable-line
          this.__base.apply(this, arguments);
        },
      },/*}}}*/

    },/*}}}*/

  };

  // Provide element...
  provide(bemDom.declElem('test', 'inner', test__inner_proto));

}); // Module end
