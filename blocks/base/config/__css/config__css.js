/* eslint-env commonjs */
/**
 * @module configCss
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2018.09.26, 23:11
 * @version 2018.09.26, 23:11
 *
 * NOTE: Rememeber to reload dev-server (webpack or enb) for accept updates!
 *
 */

(function(){

  var textColor = '#333';
  var defaultFontSize = 16;

  /** configCss ** {{{
   */
  var configCss = /** @lends config__css.prototype */ {

    textColor: textColor,
    defaultTextColor: textColor,

    primaryLightColor: '#7FA7C7',
    primaryColor: '#00508F',

    // See XD prototypes...
    primarySuperLightColor: '#E0EBF3',
    primaryBrightColor: '#BCE0FD',

    secondaryColor: '#FFC06A',

    layoutBgColor: '#F0F0F0',
    layoutLightBgColor: '#F7F7F7',

    layoutBorderColor: '#CCC',

    defaultFontSize: defaultFontSize,
    fontSize: defaultFontSize,
    fontSizeM: defaultFontSize,
    fontSizeSm: defaultFontSize - 2,
    fontSizeXs: defaultFontSize - 4,
    fontSizeLg: defaultFontSize + 2,
    fontSizeXl: defaultFontSize + 4,
    titleFontSize: defaultFontSize + 12,
    defaultFontWeight: 400,
    defaultBemFontSize: defaultFontSize,

    neutralColor: '#999',

    // Breakpoints (from bootstrap)
    breakpoint_xs: 0,
    breakpoint_sm_pre: 575.98,
    breakpoint_sm: 576,
    breakpoint_md_pre: 767.98,
    breakpoint_md: 768,
    breakpoint_lg_pre: 991.98,
    breakpoint_lg: 992,
    breakpoint_xl_pre: 1199.98,
    breakpoint_xl: 1200,

  };/*}}}*/

  /** configCss (extend) ** {{{
   */
  Object.assign(configCss, /** @lends config__css.prototype */ {

    defaultBgColor: '#fff',
    pageBgColor: '#fff',

    // Questionnaire...

    // layoutBorderColor: configCss.layoutBorderColor,
    QFrameColor: configCss.layoutBgColor, // UNUSED
    QHeaderBgColor: configCss.layoutLightBgColor, // UNUSED

    testColor: 'green', // DEBUG!

    // textColor: configCss.textColor,
    defaultTextColor: configCss.textColor,

    linkColor: configCss.primaryColor,

    // bem-components...

    bemHighlightColor: configCss.primaryLightColor, // NOTE: Derived to `$bemKeyColor`, see `bembem-components-definitions`

    bemFontSizeS: configCss.defaultBemFontSize - 2,
    bemFontSizeM: configCss.defaultBemFontSize,
    bemFontSizeL: configCss.defaultBemFontSize + 2,
    bemFontSizeXL: configCss.defaultBemFontSize + 4,

    bemLineSizeS: 24,
    bemLineSizeM: 28,
    bemLineSizeL: 32,
    bemLineSizeXL: 38,

    bemBorderColor: 'color(#000 alpha(20%))',
    bemBorderRadius: 3,

    // Misc components...

    CtlsItemHSpacing: 5,

    // Container & paddings...

    containerPadding: 15,

    // Custom breakpoints

    // Demo...

    demoBorderRadius: 5,

  });/*}}}*/

  /** Universal export... ** {{{ */
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = configCss;
  }/*}}}*/
  /** YM export... ** {{{ */
  if (typeof modules === 'object' && typeof modules.define === 'function') {
    modules.define('config__css', [], function(provide) {
      provide(configCss);
    });
  }/*}}}*/

})();
