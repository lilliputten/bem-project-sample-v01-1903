/**
 * @module App
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2018.11.02 04:41
 * @version 2018.11.02 04:41
 */

modules.define('App', [
  'i-bem-dom',
  'config',
  'helpers',
],
function define(provide,
  bemDom,
  config, // eslint-disable-line no-unused-vars
  helpers, // eslint-disable-line no-unused-vars
// eslint-disable-next-line no-unused-vars
__BASE) {

  /**
   * @exports
   * @class App
   * @bem
   */
  var _App_proto = /* @lends App.prototype */ {

    // /** _App_init ** {{{ Block init...
    //  */
    // _App_init: function() {
    // },/*}}}*/
    // /** onSetMod ** {{{ Modifiers... */
    // onSetMod: {
    //
    //   /** js ** {{{ JS lifecycle... */
    //   js: {
    //     inited: function() {
    //       this.__base.apply(this, arguments);
    //       this._App_init && this._App_init();
    //     },
    //   },/*}}}*/
    //
    // },/*}}}*/

  };

  // Provide block...
  provide(bemDom.declBlock(this.name, _App_proto));

}); // Module end
