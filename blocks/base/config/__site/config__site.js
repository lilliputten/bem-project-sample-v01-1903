/* eslint-env commonjs */
/**
 * @module config__site
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2018.09.26, 23:11
 * @version 2018.09.26, 23:11
 */

(function(){

  var siteAddr = 'dotnetweb';

  /** configSite ** {{{ */
  var configSite = /** @lends config__site.prototype */ {

    headerTitle: 'Questionnaire Editor',
    // headerLogo: '/img/Logo/itu-logo-white.svg',
    headerLogo: '/img/Logo/axiomica-on-dark.svg',
    headerLink: '/',

    siteName: 'Questionnaire Editor',

    siteAddr: siteAddr,
    siteUrl: 'http://' + siteAddr,

  };/*}}}*/

  /** Universal export... ** {{{ */
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = configSite;
  }/*}}}*/
  /** YM export... ** {{{ */
  if (typeof modules === 'object' && typeof modules.define === 'function') {
    modules.define('config__site', [], function(provide) {
      provide(configSite);
    });
  }/*}}}*/

})();
