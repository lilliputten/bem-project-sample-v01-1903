/* eslint-env es6, node, commonjs */
/* eslint-disable no-console, no-debugger, no-unused-vars */
/*
 * @module enb-repack
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2018.10.06, 00:18
 * @version 2018.10.29, 19:57
 *
 * Changelog:
 *
 * - 2018.10.29, 19:57 -- Fixed extensions fetching (for dot-filenames, eg. `.bundle*`).
 *
 */

const vfs = require('enb/lib/fs/async-fs');

const babel = require('babel-core');

const isArray = Array.isArray;

const babelifyRegExp = /^\/\*\s*eslint-env\b.*\bes6\b/m;

module.exports = require('enb/lib/build-flow').create()
  .name('enb-repack')
  .target('target', '?.repack')
  .useSourceFilename('sourceFile', '?.src')

  /** @param {String} [techId='css'|'browserJs'|'bemhtmlJs'] - Tech id. If not specified then derived from sourceFile ext */
  .defineOption('techId')

  /** @param {Boolean} [version=false] - Display detailed filtering info */
  .defineOption('verbose', false)

  /** @param {String} prjRoot - Project root */
  .defineOption('prjRoot')

  /** @param {Object} repackCfg - Repack configuration
   * @param {String[]|RegExp[]} [repackCfg.include]
   * @param {String[]|RegExp[]} [repackCfg.exclude]
  */
  .defineOption('repackCfg')

  .builder(function(srcFileName) {

    const verbose = this._verbose;
    const prjRoot = this._prjRoot;
    const repackCfg = this._repackCfg;

    // Include BEMHTML.js?
    const useBemhtml = repackCfg.useBemhtml;

    const toCamelCase = (s) => s.replace(/\W+(\w?)/g, (_, c) => c.toUpperCase());

    // Posix filename & bundleId...
    const posixFileName = srcFileName.replace(/[\\]/g, '/');
    const fnMatch = posixFileName.match(/^.*\/\.?(([^/.]*)\.(.*))$/, '$1');
    const fileName = fnMatch[1];
    const bundleId = toCamelCase(fnMatch[2]);
    const srcExt = fnMatch[3];
    const techId = this._techId || toCamelCase(srcExt);

    /** isChunkUrlMatchedOneRule ** {{{ Check for url matching at least one rule from list
     * @param {String} url
     * @param {String|RegExp} rule
     * @returns {Boolean}
     */
    const isChunkUrlMatchedOneRule = (url, rule) => {
      if (typeof url !== 'string') {
        throw new Error('Expected url as string. Got ' + (typeof url));
      }
      if (rule instanceof RegExp) {
        return rule.test(url);
      }
      else if (typeof rule === 'string') {
        return url.includes(rule);
      }
      else {
        throw new Error('Expected rule as RegExp or string. Got ' + (typeof rule));
      }
    };/*}}}*/
    /** isChunkUrlMatched ** {{{ Check for url matching at least one rule from list
     * @param {String} url
     * @param {String[]|RegExp[]} rules
     * @returns {Boolean}
     */
    const isChunkUrlMatched = (url, rules) => {
      if (!isArray(rules)) {
        throw new Error('rules must be an array. Got ' + (typeof rules));
      }
      for (let i=0; i<rules.length; i++) {
        if ( isChunkUrlMatchedOneRule(url, rules[i])) {
          return true;
        }
      }
      return false;
    };/*}}}*/
    /** isChunkFiltered ** {{{
     * @param {String} url
     * @returns {Boolean}
     */
    const isChunkFiltered = (url) => {

      let isIncluded, isExcluded;

      if (!useBemhtml) {
        if (techId === 'browserJs' && url.endsWith('BEMHTML/BEMHTML.js')) {
          verbose && console.log('SKIP BEMHTML!');
          return false;
        }
        if (techId === 'bemhtmlJs') {
          return false;
        }
      }

      // DEBUG eg:
      // (url === 'layout.blocks/header/header.css')
      // (url === 'blocks/layout/header/header.css')

      if (isArray(repackCfg.include)) {
        isIncluded = isChunkUrlMatched(url, repackCfg.include);
        // return isIncluded; // TODO: Has `isIncluded` more priority?
      }

      if (/* isIncluded == null && */ isArray(repackCfg.exclude)) {
        isExcluded = isChunkUrlMatched(url, repackCfg.exclude);
      }

      const isFiltered = (isIncluded == null || isIncluded === true)
        || (isExcluded == null || isExcluded === false);

      return isFiltered;

    };/*}}}*/

    return vfs.read(srcFileName, 'utf-8')

      /** .then ** {{{ Process content... */
      .then((content) => {

        let result = content

          // Posix EOLs
          .replace(/\r\n/g, '\n')

          // Remove sourcemaps
          .replace(/\n\s*(\/\*|\/\/)# sourceMappingURL=[\s\S]*/m, '\n')

          // Reverse `*:(begin|end)` -> `(begin|end):*`
          .replace(/(\/\*\s+)(\S*?)(\s*:(begin|end)\s*\*\/)/g, (match, begin, url, end, tag) => `/* ${tag}:${url} */`)

          /** .replace ** {{{ Normalize sections... */
          .replace(/((?:\/\*)\s*(begin|end):)\s*(\S*?)\s*(\*\/)/g, (match, begin, tag, url, end) => {
            const openClose = (tag === 'begin') ? '{{{' : '}}}';
            return `/* ${openClose} ${tag}: ${url} */`;
          })

          /** .replace ** {{{ Normalize paths... */
          .replace(/(\/\* ({{{ begin|}}} end):)\s*(\S*?)( \*\/)/g, (match, begin, openCloseTag, url, end) => {

            // Convert to posix paths...
            url = url.replace(/[\\]/g,'/');

            // Remove absolute project root...
            if ( url.indexOf(prjRoot) === 0 ) {
              url = url.substr(prjRoot.length);
            }
            // ...or any relative addressing...
            else {
              url = url.replace(/^(\.\.\/)+/, '');
            }

            // Return combined tag...
            return `/* ${openCloseTag}: ${url} */`;

          })/*}}}*/

          /** .replace ** {{{ Filtering... */
          //        12                       3       4      5         62            3    4
          .replace(/((\/\* )(?:{{{ begin):\s*(\S*?)\s*(\*\/))([\S\s]*?)(\2(?:}}} end):\s*\3\s*\4\n)/gm,
            (match, openMarkup, openC, url, endC, content, closeMarkup) => {

              let isFiltered = isChunkFiltered(url);

              // Filtered?...
              if (isFiltered) {

                // Preprocess...
                content = content
                  .replace(/(\/\*\s*DEBUG-BEGIN.*?)\*\/([\s\S]*?)\/\*(.*?DEBUG-END\s*\*\/)/gm, '$1...$3')
                  // .replace(/(\s*)\/\*\s*DEBUG\b(|[^-].*?)\*\/\s*/gm, '$1//DEBUG$2//')
                  .replace(/(\s*)\/\*\s*DEBUG\b(|[^-].*?)\*\/(.*)$/gm, '$1/* DEBUG $2 $3 */')
                  // .replace(/(HASHTAG)\s*=\s*["']([^'"]*)["']/g, '$1=\'' + CONFIG.hashTag + '\'')
                  .replace(/\/\*\s*NO-?DEBUG\s+([\s\S]*?)\s*\*\//gm, '$1')
                ;

                let isBabelify = false;
                if (techId.endsWith('Js') && (isBabelify = babelifyRegExp.test(content)) === true) {
                  const babelResult = babel.transform(content, {
                    presets: ['es2015'],
                  });
                  content = babelResult.code.replace(/^\s*'use strict';\n/m, '');
                }

                // NOTE: LOG
                verbose && (verbose !== 'excluded' || verbose === 'included') &&  console.log('+', url, [
                  isBabelify && 'BABEL' || null,
                ].join(' '));
                return openMarkup + content + closeMarkup;

              }
              else {

                // NOTE: LOG
                verbose && (verbose !== 'included' || verbose === 'excluded') && console.log(' ', url); // SKIP
                return '';

              }

            }
          )/*}}}*/

        ;

        /** bemhtmlJs ** {{{ Make BEMHTML runtime wrapper...
         */
        if (techId === 'bemhtmlJs') {
          // First opening markup (`/* begin: <...> */`)...
          const firstBegP = result.indexOf('/* {{{ begin:');
          if (firstBegP !== -1 ) {
            result = result.substr(firstBegP);
            // Last closing markup (`/* end: <...> */`)...
            const lastEndP = result.lastIndexOf('/* }}} end:');
            const lastEndCloseP = (lastEndP !== -1) && result.indexOf('*/', lastEndP);
            if (lastEndP !== -1 && lastEndCloseP && lastEndCloseP !== -1) {
              result = result.substr(0, lastEndCloseP + 3);
            }
          }
          // If no chuncks found...
          else {
            // ...make empty bundle
            result = ''; // '/* Empty bundle */\n';
          }
          // Replace with wrapping template...
          if (result) {
            result = ''
              + 'modules.require([\'BEMHTML\'],function(BEMHTML){\n'
              + 'BEMHTML.compile(function ' + bundleId + 'Templates(){\n\n'
              + result
              + '\n});'
              + '\n});'
              + '\n'
            ;
          }
          // ...or make empty...
          else {
            result = '/* (empty) */\n';
          }
        }/*}}}*/

        /** result ** {{{ Make begin..end comments
         */
        result = '/* {{{ ' + fileName + ' begin */\n'
          + result
          + '/* ' + fileName + ' end }}} */\n'
        ;/*}}}*/

        return result;

      })/*}}}*/

    // .fail(function(data) { console.error('Fail with: ', data); }) // Error? TODO?

    ;

  })
  .createTech()
;
