/* eslint-disable no-console, no-debugger */
/**
 * @module test
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2018.09.29, 23:06
 * @version 2018.09.29, 23:06
 *
 */
modules.define('test', [
  'i-bem-dom',
  // 'BEMHTML', // use only if enabled `useBemhtml` in `repack-config`
  // 'config',
], function(provide,
  bemDom,
  // BEMHTML, // use only if enabled `useBemhtml` in `repack-config`
  // config,
// eslint-disable-next-line no-unused-vars
__BASE) {

  provide(bemDom.declBlock(this.name, {
    onSetMod: {
      js: {
        inited: function() {

          /* // use only if enabled `useBemhtml` in `repack-config`
           * var
           *   bemjson = {
           *     block: 'test',
           *     elem: 'inner',
           *     content: 'test inner content',
           *   },
           *   html = BEMHTML.apply(bemjson),
           *   dom = bemDom.append(this.domElem, html)
           * ;
           * console.log('test block', dom, config, typeof BEMHTML);//eslint-disable-line
           * debugger;//eslint-disable-line
           */

        }
      }
    }
  }));

});
