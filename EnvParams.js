/* eslint-env es6, node, commonjs */

const

  // Global object
  __global = typeof global !== 'undefined' ? global: typeof module !== 'undefined' ? module: typeof window !== 'undefined' ? window: this,

  YENV = __global.YENV = ( process.env && process.env.YENV ) ? process.env.YENV: 'enb',

  DEBUG = (YENV !== 'production' && YENV !== 'inject'),

  // Dependences...
  ym = /* __global.modules = */ require('ym'),
  vow = require('vow'),
  path = require('path'),
  fs = require('fs-extra'),

  rootPath = process.cwd().replace(/[\\]/g,'/')+'/'

;

// DEBUG...
// console.log('YENV:', YENV);
// console.log('DEBUG:', DEBUG);

const EnvParams = {

  YENV: YENV,
  MODE: YENV,

  DEBUG: DEBUG,

  vow: vow,
  path: path,
  fs: fs,

  rootPath: rootPath,

  global: __global,

  // Use local assets or CDN links. TODO: Depends on YENV?
  useLocalAssets: DEBUG || true,
  // Use `.min` ext for some assets
  useMinifiedAssets: DEBUG && true,

  // Use bootsrtap?
  useBootstrap: false,

  ym: ym,
  modules: ym,

};

module.exports = EnvParams;

