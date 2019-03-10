/* eslint-env es6, node, commonjs */
/* eslint-disable no-console */
/**
 * @module gulpfile
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2018.09
 * @version 2018.10.25, 06:48
 */

/*{{{ General requirements... */

const

  gulp = require('gulp'),

  gulpIf = require('gulp-if'), // https://github.com/robrich/gulp-if
  // gulpIgnore = require('gulp-ignore'), // https://www.npmjs.com/package/gulp-ignore
  // mergeStream = require('merge-stream'),

  lazypipe = require('lazypipe'), // https://github.com/OverZealous/lazypipe

  // gulpSort = require('gulp-sort'),
  // insert = require('gulp-insert'),

  rename = require('gulp-rename'), // https://www.npmjs.com/package/gulp-rename

  through = require('gulp-through'), // https://www.npmjs.com/package/gulp-through

  fs = require('fs-extra'),
  path = require('path'),
  yaml = require('js-yaml'),

  // processing...

  del = require('del'),
  // concat = require('gulp-concat'),
  // template = require('gulp-template'),
  // preprocess = require('gulp-preprocess'),

  // sourcemaps = require('gulp-sourcemaps'), // https://www.npmjs.com/package/gulp-sourcemaps
  cssmin = require('gulp-cssmin'), // https://www.npmjs.com/package/gulp-cssmin
  uglifyJs = require('gulp-uglify'), // https://www.npmjs.com/package/gulp-uglify
  replace = require('gulp-replace'), // https://www.npmjs.com/package/gulp-replace

  __REQUIRES_END = null
;

/*}}}*/
/*{{{ Variables... */

const

  // date
  now = new Date(),

  // hash, data tags...
  dateTag = require('dateformat')(now, 'yymmdd-HHMMss'),
  hashTag = require('md5')(dateTag).substr(0,6),

  // npm project config
  PROJECT = require('./package.json'),

  // repack configuration
  repackCfg = require('./repack-config'),
  // Use bemhtml on client?
  useBemhtml = repackCfg.useBemhtml,

  // Файл конфигурации
  CONFIG_FILE = 'gulpfile.config.yaml',
  // Инициируем конфиг
  CONFIG = fs.existsSync(CONFIG_FILE) && yaml.load(fs.readFileSync(CONFIG_FILE), 'utf8') || {},

  // // Корневая папка проекта (2017.03.15, 20:14 -- не используется?)
  // PROJECT_ROOT = process.cwd().replace(/\\/g,'/').replace(/([^\/])$/,'$1/'),

  __VARIABLES_END = null
;

console.info('hashTag', hashTag);

// Extending config...
Object.assign(CONFIG, {
  projectName : PROJECT.name,
  projectVersion : PROJECT.version,
  dateTag : dateTag,
  hashTag : hashTag,
  projectTag : PROJECT.version + ' @ ' + dateTag + ' | ' + hashTag,
});
CONFIG.projectTagFull = PROJECT.name + ' v.' + CONFIG.projectTag;
CONFIG.projectTagFullComment = '<!-- ' + CONFIG.projectTagFull + ' -->';

/*}}}*/
/*{{{ Tools... */

const

  /** Debug pipe */
  gulpDebug = true && require('gulp-debug') || through('noDebug', () => null),

  /** expandFilesList ** {{{ Дополнить пути в массиве (постфиксная маска, префиксный путь)
   * @param {string[]} [files] - Список файлов
   * @param {string} [prefix] - Путь, добавляемый перед именем файла
   * @returns {string[]}
   */
  expandFilesList = (files, prefix) => {
    if (!Array.isArray(files)) {
      return '';
    }
    // || ( files = [] );
    return files.map( (file) => {
      file = file.endsWith('/') && file + '**/*' || file;
      if ( prefix ) {
        file = path.posix.join(prefix, file);
      }
      return file;
    });
  },/*}}}*/

  __TOOLS_END = null
;

/*}}}*/

/*{{{ Tasks... */

/*{{{ Init & clean... */

/** copyNpmAssets ** {{{
 */
gulp.task('copyNpmAssets', (done) => {
  const destPath = path.posix.join(CONFIG.TARGET_PATH, CONFIG.TARGET_ASSETS_PATH);
  const filesList = expandFilesList(CONFIG.NPM_ASSETS_FILES, CONFIG.NPM_ASSETS_PATH);
  return filesList ? gulp.src( filesList, { base: CONFIG.NPM_ASSETS_PATH } )
      .pipe( gulp.dest( destPath ) )
      .pipe( gulpDebug({ title: 'copyNpmAssets ->' }) )
  : done();
});/*}}}*/
/** copyRootAssets ** {{{
 */
gulp.task('copyRootAssets', (done) => {
  const destPath = path.posix.join(CONFIG.TARGET_PATH, CONFIG.TARGET_ASSETS_PATH);
  const filesList = expandFilesList(CONFIG.ASSETS_FILES, CONFIG.ASSETS_PATH);
  const stream = filesList ? gulp.src( filesList, { base: CONFIG.ASSETS_PATH } )
    .pipe( gulp.dest( destPath ) )
    .pipe( gulpDebug({ title: 'copyRootAssets ->' }) )
  : done();
  return stream;
});/*}}}*/
/** copyPublic ** {{{
 */
gulp.task('copyPublic', (done) => {
  const destPath = path.posix.join(CONFIG.TARGET_PATH, CONFIG.TARGET_PUBLIC_PATH);
  const filesList = expandFilesList(CONFIG.PUBLIC_FILES, CONFIG.PUBLIC_PATH);
  const stream = filesList ? gulp.src( filesList, { base: '' } )
    .pipe( gulp.dest( destPath ) )
    .pipe( gulpDebug({ title: 'copyPublic ->' }) )
  : done();
  return stream;
});/*}}}*/
/** copyRoot ** {{{
 */
gulp.task('copyRoot', (done) => {
  const destPath = path.posix.join(CONFIG.TARGET_PATH, '');
  const filesList = expandFilesList(CONFIG.ROOT_FILES, '');
  const stream = filesList ?  gulp.src( filesList, { base: './' } )
    .pipe( gulp.dest( destPath ) )
    .pipe( gulpDebug({ title: 'copyRoot ->' }) )
  : done();
  return stream;
});/*}}}*/
/** minimizeAfterInit ** {{{
 */
gulp.task('minimizeAfterInit', (done) => {
  // const destPath = path.posix.join(CONFIG.TARGET_PATH, '');
  const filesList = expandFilesList(CONFIG.MINIMIZE_AFTER_INIT, CONFIG.TARGET_PATH);
  const stream = filesList ? gulp.src( filesList, { base: CONFIG.TARGET_PATH } )
    .pipe( gulpIf((file) => file.path.endsWith('.js'), uglifyJs()) )
    .pipe( gulpIf((file) => file.path.endsWith('.css'), cssmin()) )
    .pipe( replace(/(\s*?\*\/)+/g, '*/') ) // Fix for nested css comments ???
    .pipe( rename({ suffix : '.min' }) )
    .pipe( gulp.dest( CONFIG.TARGET_PATH ) )
    .pipe( gulpDebug({ title: 'minimizeAfterInit ->' }) )
  : done();
  return stream;
});/*}}}*/
/** init ** {{{
 */
gulp.task('init',
  gulp.series(
    gulp.parallel('copyNpmAssets', 'copyRootAssets', 'copyPublic', 'copyRoot'),
    'minimizeAfterInit'
  )
);/*}}}*/

/** clean ** {{{
 */
gulp.task('clean', (next) => {
  const rmPath = path.posix.join(CONFIG.TARGET_PATH, '**/*');
    // console.info( 'cleanTarget:', files.map( file => '\n- ' + file ).join('') );
    return del(rmPath, { force: true }, next );
});/*}}}*/

/*}}}*/

/*{{{ Make... */

/** make ** {{{ */
gulp.task( 'make', () => {
    process.env.YENV = 'inject';
    const
        enb = require('enb/lib/api'),
        makePromise = enb.make()
    ;
    makePromise.fail( (e) => {
        console.error( 'Error:', e );
        process.exit(1);
    });
    return makePromise;
});/*}}}*/

/*}}}*/

/*{{{ Inject... */

const mergedBundlePath = path.posix.join(CONFIG.PAGES_PATH, CONFIG.MERGED_BUNDLE_SRC_NAME);
const mergedBundleIndexPath = path.posix.join(CONFIG.BUNDLE_PAGES_PATH, CONFIG.BUNDLE_INDEX_NAME);

// /** preprocessCode ** {{{ Общий препроцессинг для php и js */
// const preprocessCode = lazypipe()
//   .pipe(replace, /(\/\*\s*DEBUG-BEGIN.*?)\*\/([\s\S]*?)\/\*(.*?DEBUG-END\s*\*\/)/gm, '$1...$3') // '$1$2...$2$4')
//   .pipe(replace, /(\s*)\/\*\s*DEBUG\b(|[^-].*?)\*\/\s*/gm, '$1//DEBUG$2// ')
//   .pipe(replace, /(HASHTAG)\s*=\s*["']([^'"]*)["']/g, '$1=\'' + CONFIG.hashTag + '\'')
//   .pipe(replace, /\/\*\s*NO-?DEBUG\s+([\s\S]*?)\s*\*\//gm, '$1')
// ;/*}}}*/
// /** uglifyJsAsset ** {{{ Препроцессинг и минимизация JS */
// const uglifyJsAsset = lazypipe()
//   .pipe( uglifyJs )
//   // .pipe( gulpDebug, { title : 'uglifyJsAsset' } )
//   // .pipe( gulpIf, [ (_) => { return CONFIG.UGLIFY_MIN_ASSETS; }, uglifyJs ] )
//   // .pipe( gulpIf, [ (file) => CONFIG.UGLIFY_MIN_ASSETS, uglifyJs, emptyStream] ) // eslint-disable-line no-unused-vars
//   // .pipe( gulpIgnore.exclude((file) => !CONFIG.UGLIFY_MIN_ASSETS) )
//   // .pipe( uglifyJs ) // NOTE: Зкоментировать для отладки препроцессинга
// ;
// /*}}}*/

/** injectMergedJs ** {{{
 */
gulp.task('injectMergedJs', () => {
  const destPath = path.posix.join(CONFIG.TARGET_PATH, CONFIG.TARGET_JS_PATH);
  // Use full bundle or only browser tech regards param useBemhtml (repackCfg)...
  const jsFileMask = CONFIG.MERGED_BUNDLE_SRC_NAME + (useBemhtml ? '' : '.browser') + '.repack.js';
  const filesList = expandFilesList([
     jsFileMask,
  ], mergedBundlePath);
  return gulp.src(filesList, { base: mergedBundlePath } )
    .pipe( gulpDebug({ title: 'injectMergedJs <-' }) )
    .pipe( rename( (path) => {
      path.basename = path.basename
        .replace('.repack', '')
        .replace(CONFIG.MERGED_BUNDLE_SRC_NAME, CONFIG.MERGED_BUNDLE_NAME)
      ;
    }) )
    .pipe( gulp.dest( destPath ) )
    .pipe( gulpDebug({ title: 'injectMergedJs ->' }) )
    .pipe( uglifyJs() )
    .pipe( rename({ suffix : '.min' }) )
    .pipe( gulp.dest( destPath ) )
    .pipe( gulpDebug({ title: 'injectMergedJs ->' }) )
  ;
});/*}}}*/
/** injectMergedCss ** {{{
 */
gulp.task('injectMergedCss', () => {
  const destPath = path.posix.join(CONFIG.TARGET_PATH, CONFIG.TARGET_CSS_PATH);
  const filesList = expandFilesList([
    CONFIG.MERGED_BUNDLE_SRC_NAME + '.repack.css', // '.{css,min.css}'
  ], mergedBundlePath);
  return gulp.src(filesList, { base: mergedBundlePath } )
    .pipe( gulpDebug({ title: 'injectMergedCss <-' }) )
    .pipe( rename( (path) => {
      path.basename = path.basename
        .replace('.repack', '')
        .replace(CONFIG.MERGED_BUNDLE_SRC_NAME, CONFIG.MERGED_BUNDLE_NAME)
      ;
    }) )
    // Npm assets links...
    .pipe( replace(/\b(url\(["']?)(?:\/|\.\.\/\.\.\/)node_modules\//g, '$1' + CONFIG.PAGES_ROOT_PATH + CONFIG.TARGET_ASSETS_PATH) )
    .pipe( gulp.dest( destPath ) )
    .pipe( gulpDebug({ title: 'injectMergedCss ->' }) )
    .pipe( cssmin() )
    .pipe( rename({ suffix : '.min' }) )
    .pipe( gulp.dest( destPath ) )
    .pipe( gulpDebug({ title: 'injectMergedCss ->' }) )
  ;
});/*}}}*/

/** injectBundleJs ** {{{
 */
gulp.task('injectBundleJs', () => {
  const destPath = path.posix.join(CONFIG.TARGET_PATH, CONFIG.TARGET_JS_PATH);
  // Use full bundle or only browser tech regards param useBemhtml (repackCfg)...
  const jsFileMask = CONFIG.BUNDLE_INDEX_NAME + (useBemhtml ? '' : '.browser') + '.bundleRepack.js';
  const filesList = expandFilesList([
     jsFileMask,
  ], mergedBundleIndexPath);
  return gulp.src(filesList, { base: mergedBundleIndexPath } )
    .pipe( gulpDebug({ title: 'injectBundleJs <-' }) )
    .pipe( rename( (path) => {
      path.basename = path.basename
        .replace('.bundleRepack', '')
        // .replace(CONFIG.BUNDLE_INDEX_NAME, CONFIG.BUNDLE_BUNDLE_NAME)
      ;
    }) )
    .pipe( gulp.dest( destPath ) )
    .pipe( gulpDebug({ title: 'injectBundleJs ->' }) )
    .pipe( uglifyJs() )
    .pipe( rename({ suffix : '.min' }) )
    .pipe( gulp.dest( destPath ) )
    .pipe( gulpDebug({ title: 'injectBundleJs ->' }) )
  ;
});/*}}}*/
/** injectBundleCss ** {{{
 */
gulp.task('injectBundleCss', () => {
  const destPath = path.posix.join(CONFIG.TARGET_PATH, CONFIG.TARGET_CSS_PATH);
  const filesList = expandFilesList([
    CONFIG.BUNDLE_INDEX_NAME + '.bundleRepack.css', // '.{css,min.css}'
  ], mergedBundleIndexPath);
  return gulp.src(filesList, { base: mergedBundleIndexPath } )
    .pipe( gulpDebug({ title: 'injectBundleCss <-' }) )
    .pipe( rename( (path) => {
      path.basename = path.basename
        .replace('.bundleRepack', '')
        // .replace(CONFIG.BUNDLE_INDEX_NAME, CONFIG.BUNDLE_BUNDLE_NAME)
      ;
    }) )
    // Npm assets links...
    .pipe( replace(/\b(url\(["']?)(?:\/|\.\.\/\.\.\/)node_modules\//g, '$1' + CONFIG.PAGES_ROOT_PATH + CONFIG.TARGET_ASSETS_PATH) )
    .pipe( gulp.dest( destPath ) )
    .pipe( gulpDebug({ title: 'injectBundleCss ->' }) )
    .pipe( cssmin() )
    .pipe( rename({ suffix : '.min' }) )
    .pipe( gulp.dest( destPath ) )
    .pipe( gulpDebug({ title: 'injectBundleCss ->' }) )
  ;
});/*}}}*/

/** pagesPipeDefault ** {{{ Preprocess JS pipe
 * @v 2018.11.05, 23:20
 */
const pagesPipeDefault = lazypipe()
  // Title (?)...
  .pipe( replace, /(<title>)/g, '$1(bundled) ' )
  // Npm assets links...
  .pipe( replace, /\b(src|href)="(?:\/|\.\.\/\.\.\/)node_modules\//g, '$1="' + CONFIG.PAGES_ROOT_PATH + CONFIG.TARGET_ASSETS_PATH )
  // Public -> root links...
  .pipe( replace, /\b(src|href)="(?:\/|\.\.\/\.\.\/)public\//g, '$1="' + CONFIG.PAGES_ROOT_PATH )
  // Bundle local resources...
  .pipe( replace, /\b(src|href)="([\w-]+)(\.(css))"/g, '$1="' + CONFIG.PAGES_ROOT_PATH + '$4/' + CONFIG.MERGED_BUNDLE_NAME + '$3"' )
  .pipe( replace, /\b(src|href)="([\w-]+)(?:\.(?:browser|bemhtml))?(\.(js))"/g, '$1="' + CONFIG.PAGES_ROOT_PATH + '$4/' + CONFIG.MERGED_BUNDLE_NAME + (useBemhtml ? '' : '.browser') + '$3"' )
  // !!!
  .pipe( replace, /([ \t]*<script src="[^"]+\.js"><\/script>)\n\1/g, '$1' )
  // Root links...
  .pipe( replace, /\b(src|href)="(?:\/|\.\.\/\.\.\/)/g, '$1="' + CONFIG.PAGES_ROOT_PATH )
  // hashTag
  .pipe( replace, /\{hashTag\}/g, hashTag )
;
/*}}}*/

const escapeRegExp = new RegExp('([./])', 'g');

// RegExp: Replace links for production (see below)
const reBundleAssets = new RegExp('\\b((?:src|href)="[\\.\\/]*(css|js)/(?:' + CONFIG.MERGED_BUNDLE_NAME + '|' + CONFIG.BUNDLE_INDEX_NAME + ')(?:(?:\\.browser|\\.bemhtml|)))(\\.\\2)(")', 'g');
//                                    1%          %           2      2                                                                       %  %                        %%13       3

/** pagesPipeMinimize ** {{{ Minimize JS pipe
 * @v 2018.11.05, 23:20
 */
const pagesPipeMinimize = lazypipe()
  // Replace links for production...
  .pipe( replace, reBundleAssets, '$1.min$3?' + hashTag + '$4' )
;
/*}}}*/

/** injectPages ** {{{
 */
gulp.task('injectPages', () => {
  const destPath = path.posix.join(CONFIG.TARGET_PATH, CONFIG.TARGET_PAGES_PATH);

  // @v 2018.11.05, 23:20
  return gulp.src(CONFIG.PAGES_PATH + '*/*.html', { base: CONFIG.PAGES_PATH } )

    .pipe( gulpDebug({ title: 'injectPages <-' }) )
    // Add 'debug' suffix...
    .pipe( rename( (path) => {
      path.dirname = '';
      path.basename += '.debug';
    }) )

    // Default preparations...
    .pipe( pagesPipeDefault() )

    // Write debug results...
    .pipe( gulpDebug({ title: 'injectPages ->' }) )

    .pipe( gulp.dest( destPath ) )

    // Remove 'debug' suffix...
    .pipe( rename( (path) => {
      path.basename = path.basename.replace('.debug', '');
    }) )

    // Make production...
    .pipe( pagesPipeMinimize() )

    // Write production results...
    .pipe( gulpDebug({ title: 'injectPages ->' }) )
    .pipe( gulp.dest( destPath ) )

  ;

});/*}}}*/

const pagesPipeBundleRegExpStr = CONFIG.PAGES_ROOT_PATH.replace(escapeRegExp, '\\$1');
const pagesPipeBundleRegExp = new RegExp('\\b((?:src|href)=")' + pagesPipeBundleRegExpStr, 'g');
const pageLinksPipeBundleRegExp = new RegExp('\\b((?:src|href)=("))[./]*(' + CONFIG.TARGET_PAGES_PATH.replace(escapeRegExp, '\\$1') + ')([\\w-]+)\\/(\\4\\.html)\\2', 'g');
//                                               1             2        3                                                               4        5
const bundleOwnAssetsRegExp = new RegExp('^(\\s*<(link|script)\\b[^<>]*(?:src|href)=(")[^"]*)\\b(' + CONFIG.MERGED_BUNDLE_NAME + ')(\\b[^"]*\\.(?:js|css))(\\3[^<>]*>(<\\/?\\2>)?\\n)', 'gm');
//                                         1     2                                  3      <1   4                                <45                    <56          7             <6
/** pagesPipeBundle ** {{{ Preprocess JS pipe
 * @v 2018.11.05, 23:57
 */
const pagesPipeBundle = lazypipe()
  // Own bundle index assets...
  .pipe( replace, bundleOwnAssetsRegExp, '$&$1' + CONFIG.BUNDLE_INDEX_NAME + '$5$6')
  // Root paths relative to bundle index (from abs. root)...
  .pipe( replace, pagesPipeBundleRegExp, '$1/' + CONFIG.BUNDLE_PAGES_ROOT_PATH )
  // Pages (from abs. root -- due to server 403/404 handlers)...
  .pipe( replace, pageLinksPipeBundleRegExp, '$1/$3$5?' + hashTag + '$2' )
;
/*}}}*/

/** injectBundleIndexPages ** {{{
 */
gulp.task('injectBundleIndexPages', () => {
  const destPath = path.posix.join(CONFIG.TARGET_PATH);

  // @v 2018.11.05, 23:20
  return gulp.src(CONFIG.BUNDLE_PAGES_PATH + '*/*.html', { base: CONFIG.BUNDLE_PAGES_PATH } )

    .pipe( gulpDebug({ title: 'injectBundleIndexPages <-' }) )
    // Add 'debug' suffix...
    .pipe( rename( (path) => {
      path.dirname = '';
      path.basename += '.debug';
    }) )

    // Default preparations...
    .pipe( pagesPipeDefault() )

    // Bundle-specific preparations...
    .pipe( pagesPipeBundle() )

    // Write debug results...
    .pipe( gulpDebug({ title: 'injectPages ->' }) )

    .pipe( gulp.dest( destPath ) )

    // Remove 'debug' suffix...
    .pipe( rename( (path) => {
      path.basename = path.basename.replace('.debug', '');
    }) )

    // Make production...
    .pipe( pagesPipeMinimize() )

    // Write production results...
    .pipe( gulpDebug({ title: 'injectBundleIndexPages ->' }) )
    .pipe( gulp.dest( destPath ) )
  ;
});/*}}}*/

/** inject ** {{{
 */
gulp.task('inject',
  gulp.parallel('injectMergedCss', 'injectMergedJs', 'injectPages',
    'injectBundleCss', 'injectBundleJs', 'injectBundleIndexPages')
);/*}}}*/

/*}}}*/

/*{{{ Integral... */

/** remake ** {{{
 */
gulp.task('remake',
  gulp.series('make', 'inject')
);/*}}}*/

/** rebuild ** {{{
 */
gulp.task('rebuild',
  gulp.series(
    gulp.parallel(
      gulp.series('clean', 'init'),
      'make'
    ),
    'inject'
  )
);/*}}}*/

/*}}}*/

/*}}}*/
