/* eslint-env es6, node, commonjs */
/* eslint-disable no-console */
/**
 * @description enb make file
 * @version 2018.10.01, 03:31
 *
 * @see:
 *   - [Как собрать проект / ENB / Инструментарий / БЭМ](https://ru.bem.info/toolbox/enb/build-project/)
 *   - [enb/README.ru.md at master · enb/enb](https://github.com/enb/enb/blob/master/README.ru.md)
 *   - [Сборка merged-бандла / enb-bem-techs / Пакеты ENB / ENB / Инструментарий / БЭМ](https://ru.bem.info/toolbox/enb/packages/enb-bem-techs/build-merged-bundle/)
 *   - [Сборка дистрибутива / enb-bem-techs / Пакеты ENB / ENB / Инструментарий / БЭМ](https://ru.bem.info/toolbox/enb/packages/enb-bem-techs/build-dist/)
 */

/** Defines... ** {{{
 */
const

  // isProd = (process.env.YENV === 'production'),

  // Dependencies...
  fs = require('fs-extra'),
  path = require('path'),// .posix,

  srcRoot = process.cwd(), // .replace(/\\/g, '/'),
  prjRoot = srcRoot.replace(/\\/g, '/'),

  // Bem-project config
  bemrc = require('../.bemrc.js'),

  // Source levels
  srcLevels = Object.keys(bemrc.levels),

  /** systemLevels ** {{{ System-level levels
   */
  systemLevels = [
    { path: 'node_modules/bem-core/common.blocks', check: false },
    { path: 'node_modules/bem-core/desktop.blocks', check: false },
    { path: 'node_modules/bem-components/common.blocks', check: false },
    { path: 'node_modules/bem-components/desktop.blocks', check: false },
    { path: 'node_modules/bem-components/design/common.blocks', check: false },
    { path: 'node_modules/bem-components/design/desktop.blocks', check: false },
  ],/*}}}*/

  // All project levels
  levels = systemLevels.concat(srcLevels),

  // repack config
  repackCfg = require('../repack-config'),

  // Parameters...
  bemjsonFilesMask = repackCfg.bemjsonFilesMask || '?.bemjson',
  pagesSrcPath = repackCfg.pagesSrcPath || 'pages',
  bundlePagesSrcPath = repackCfg.bundlePagesSrcPath || 'bundle-pages',
  mergedBundleName = repackCfg.bundleName || '.bundle',
  mergedBundlePath = repackCfg.mergedBundlePath || path.join(pagesSrcPath, mergedBundleName),

  // distPath = 'dist',

  /** Techs... ** {{{
   */
  techs = {

    // css: require('enb/techs/css'),
    // js: require('enb/techs/js'),

    // essential
    fileProvider: require('enb/techs/file-provider'),
    fileMerge: require('enb/techs/file-merge'),

    // optimization
    borschik: require('enb-borschik/techs/borschik'),

    // postcss css
    postcss: require('enb-postcss/techs/enb-postcss'),

    // js
    browserJs: require('enb-js/techs/browser-js'), // node_modules\enb-js\techs\browser-js.js

    // bemhtml
    bemhtmlJs: require('enb-bemxjst/techs/bemhtml'), // node_modules/enb-bemxjst/techs/bemhtml.js
    bemjsonToHtml: require('enb-bemxjst/techs/bemjson-to-html'),

    repack: require('./techs/enb-repack'),

    // beautify
    htmlBeautify: require('./techs/enb-beautify-html'),

  },/*}}}*/

  // CSS project-wide constants...
  config = require('../blocks/make-time/config/config.js'),
  configCss = config.css, // require('../blocks/make-time/config/__css/config__css.js'),

  /** postcssPlugins ** {{{
   */
  postcssPlugins = [

    // From project-stub...
    require('postcss-import'),
    require('postcss-mixins')({
      mixinsDir: path.join(prjRoot, 'blocks', '!mixins'),
    }), // https://github.com/postcss/postcss-mixins
    require('postcss-each'),
    require('postcss-for'),
    require('postcss-define-function'), // https://github.com/titancat/postcss-define-function
    require('postcss-advanced-variables')({ // https://github.com/jonathantneal/postcss-advanced-variables
      // unresolved: 'warn', // 'ignore',
      variables: configCss,
    }),
    require('postcss-simple-vars')(),
    require('postcss-conditionals'), // Already used (scss?)
    require('postcss-color-function'), // https://github.com/postcss/postcss-color-function
    require('postcss-calc')(),
    require('postcss-nested-ancestors'), // https://github.com/toomuchdesign/postcss-nested-ancestors
    require('postcss-nested'),
    require('rebem-css'),
    require('postcss-url')({ url: 'rebase' }),
    require('autoprefixer')(),
    require('postcss-reporter')(),

    // Custom...
    // require('postcss-bootstrap-4-grid')(),

  ],/*}}}*/

  /** postcssTechConfig ** {{{
   */
  postcssTechConfig = [techs.postcss, {
    target: '?.css',
    parser: require('postcss-scss'),
    comments : true,
    sourcemap : true,
    oneOfSourceSuffixes: ['post.css', 'css'],
    plugins: postcssPlugins,
  }],/*}}}*/

  /** bemhtmlJsTechConfig ** {{{
   */
  bemhtmlJsTechConfig = [techs.bemhtmlJs, {
    sourceSuffixes: ['bemhtml', 'bemhtml.js'],
    forceBaseTemplates: true,
    sourceRoot: srcRoot, // Project root path
    sourcemap: true,
    engineOptions : {
      elemJsInstances : true,
    },
  }],/*}}}*/
  /** browserJsTechConfig ** {{{
   */
  browserJsTechConfig = [techs.browserJs, {
    target: '?.browser.js',
    includeYM: false, // Using external ym!!!
    compress : false,
    sourcemap : true,
  }],/*}}}*/

  // Enb techs engine
  enbBemTechs = require('enb-bem-techs'),

  /** commonTechs ** {{{ List of techs for `addTechs/addTech`
   */
  commonTechs = [

    [enbBemTechs.levels, { levels: levels }],
    [enbBemTechs.deps],
    [enbBemTechs.files],

    postcssTechConfig,

    // bemhtmlJs/browserJs...
    bemhtmlJsTechConfig,
    browserJsTechConfig,

    // Merging...
    [techs.fileMerge, {
      target: '?.js',
      sourcemap: true,
      sources: [
        '?.bemhtml.js',
        '?.browser.js',
      ]
    }],
    [techs.fileMerge, {
      target: '?.repack.js',
      sources: [
        '?.browser.repack.js',
        '?.bemhtml.repack.js',
      ]
    }],

    // client bemhtml
    [enbBemTechs.deps, {
      target: '?.bemhtml.deps.js',
      bemdeclFile: '?.bemhtml.bemdecl.js'
    }],
    [enbBemTechs.files, {
      depsFile: '?.bemhtml.deps.js',
      filesTarget: '?.bemhtml.files',
      dirsTarget: '?.bemhtml.dirs'
    }],
    [techs.bemhtmlJs, {
      target: '?.browser.bemhtml.js',
      sourcemap: false,
      filesTarget: '?.bemhtml.files',
      sourceSuffixes: ['bemhtml', 'bemhtml.js'],
      engineOptions : { elemJsInstances : true },
    }],

    // [techs.borschik, { source: '?.js', target: '?.min.js', minify: isProd }],
    // [techs.borschik, { source: '?.css', target: '?.min.css', minify: isProd }],

    [techs.repack, {
        sourceFile: '?.css',
        target: '?.repack.css',
        verbose: repackCfg.verbose,
        prjRoot,
        repackCfg,
    }],
    [techs.repack, {
        sourceFile: '?.browser.js',
        target: '?.browser.repack.js',
        verbose: repackCfg.verbose,
        prjRoot,
        repackCfg,
    }],
    [techs.repack, {
        sourceFile: '?.bemhtml.js',
        target: '?.bemhtml.repack.js',
        verbose: repackCfg.verbose,
        prjRoot,
        repackCfg,
    }],

  ],/*}}}*/
  /** commonTargets ** {{{ List of targets for `addTargets`
   */
  commonTargets = [

    // '?.htm',
    // '?.html',

  ]
  // .concat(isProd ? [
  //
  //   '?.min.css',
  //   '?.min.js',
  //
  // ] : [])
/*}}}*/

;/*}}}*/

module.exports = function(config) {

  /** Regular bundles (pages) ** {{{*/

  const allPagesGlob = path.join(pagesSrcPath, '*');
  config.nodes(allPagesGlob, function(nodeConfig) {

    const node = path.basename(nodeConfig.getPath());

    if (node !== mergedBundleName) {

      /** nodeConfig.addTechs ** {{{ Regular techs
       */
      nodeConfig.addTechs(commonTechs.concat([

        [enbBemTechs.depsByTechToBemdecl, {
          target: '?.bemhtml.bemdecl.js',
          sourceTech: 'js',
          destTech: 'bemhtml'
        }],

        [techs.fileProvider, { target: bemjsonFilesMask }],
        [enbBemTechs.bemjsonToBemdecl, { source: bemjsonFilesMask }],

        // html
        [techs.bemjsonToHtml, {
          bemjsonFile: bemjsonFilesMask,
          target: '?.htm',
        }],
        [techs.htmlBeautify, {
          htmlFile: '?.htm',
          target: '?.html',
        }],

        // // JSON
        // [techs.bemjsonToJson, {
        //     bemjsonFile: bemjsonFilesMask,
        // }],

      ]));/*}}}*/

      /** addTargets... ** {{{ Regular targets
       */
      nodeConfig.addTargets(commonTargets.concat([

        '?.htm',
        '?.html',

        '?.css',
        '?.js',

      ]));
      /*}}}*/

    }

  });

  /*}}}*/

  /** Merged bundle ** {{{*/
  config.nodes(mergedBundlePath, function (nodeConfig) {

    /** Collect bemdeclFiles ... ** {{{
     */
    const dir = path.dirname(nodeConfig.getPath());
    const bundles = fs.readdirSync(dir);
    const bemdeclFiles = [];
    const bemhtmlBemdeclFiles = [];

    bundles
      .filter((bundle) => !(bundle.startsWith('.') || bundle === mergedBundleName))
      .map((bundle) => {

        const node = path.join(dir, bundle);
        const target = bundle + '.bemdecl.js';
        const bemhtmlTarget = bundle + '.bemhtml.bemdecl.js';

        nodeConfig.addTechs([
          [enbBemTechs.provideBemdecl, {
            node: node,
            target: target,
          }],
          [enbBemTechs.provideBemdecl, {
            node: node,
            target: bemhtmlTarget,
          }],
        ]);

        bemdeclFiles.push(target);
        bemhtmlBemdeclFiles.push(bemhtmlTarget);

      })
    ;/*}}}*/

    /** addTechs ** {{{ Merged techs
     */
    nodeConfig.addTechs(commonTechs.concat([

      // Combine bemdecls
      [enbBemTechs.mergeBemdecl, { sources: bemdeclFiles }],
      [enbBemTechs.mergeBemdecl, { sources: bemhtmlBemdeclFiles, target: '?.bemhtml.bemdecl.js' }],

    ]));/*}}}*/

    /** addTargets... ** {{{ Merged targets
     */
    nodeConfig.addTargets(commonTargets
      .concat([

        '?.bemhtml.js',
        '?.browser.bemhtml.js',

        '?.repack.css',
        '?.repack.js',

      ])
    );
    /*}}}*/

  });

  /*}}}*/

  /** Bundle index pages ** {{{*/

  const bundlePagesGlob = path.join(bundlePagesSrcPath, '*');
  config.nodes(bundlePagesGlob, function(nodeConfig) {

    const node = path.basename(nodeConfig.getPath());

    const bundleRepackCfg = repackCfg.overrideBundlePages ? Object.assign({}, repackCfg, repackCfg.overrideBundlePages) : repackCfg;

    if (node !== mergedBundleName) {

      /** nodeConfig.addTechs ** {{{ Regular techs
       */
      nodeConfig.addTechs(commonTechs.concat([

        [enbBemTechs.depsByTechToBemdecl, {
          target: '?.bemhtml.bemdecl.js',
          sourceTech: 'js',
          destTech: 'bemhtml'
        }],

        [techs.fileProvider, { target: bemjsonFilesMask }],
        [enbBemTechs.bemjsonToBemdecl, { source: bemjsonFilesMask }],

        // html
        [techs.bemjsonToHtml, {
          bemjsonFile: bemjsonFilesMask,
          target: '?.htm',
        }],
        [techs.htmlBeautify, {
          htmlFile: '?.htm',
          target: '?.html',
        }],

        // // JSON
        // [techs.bemjsonToJson, {
        //     bemjsonFile: bemjsonFilesMask,
        // }],

        [techs.repack, {
            sourceFile: '?.css',
            target: '?.bundleRepack.css',
            verbose: bundleRepackCfg.verbose,
            prjRoot,
            repackCfg: bundleRepackCfg,
        }],
        [techs.repack, {
            sourceFile: '?.browser.js',
            target: '?.browser.bundleRepack.js',
            verbose: bundleRepackCfg.verbose,
            prjRoot,
            repackCfg: bundleRepackCfg,
        }],
        [techs.repack, {
            sourceFile: '?.bemhtml.js',
            target: '?.bemhtml.bundleRepack.js',
            verbose: bundleRepackCfg.verbose,
            prjRoot,
            repackCfg: bundleRepackCfg,
        }],

        // // Merging...
        // [techs.fileMerge, {
        //   target: '?.js',
        //   sourcemap: true,
        //   sources: [
        //     '?.bemhtml.js',
        //     '?.browser.js',
        //   ]
        // }],
        [techs.fileMerge, {
          target: '?.bundleRepack.js',
          sources: [
            '?.browser.bundleRepack.js',
            '?.bemhtml.bundleRepack.js',
          ]
        }],


      ]));/*}}}*/

      /** addTargets... ** {{{ Regular targets
       */
      nodeConfig.addTargets(commonTargets.concat([

        '?.htm',
        '?.html',

        '?.css',
        '?.js',

        '?.bundleRepack.css',
        '?.bemhtml.bundleRepack.js',
        '?.browser.bundleRepack.js',
        '?.bundleRepack.js',

      ]));
      /*}}}*/

    }

  });

  /*}}}*/

};
