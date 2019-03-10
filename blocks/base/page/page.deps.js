({
  mustDeps: [
    'i-bem',
    'common',
  ],
  shouldDeps: [

    // Page specific...

    { mods: [
      'BundleIndex',
    ]},

    // Global app requirements...

    'i-bem-dom',
    'objects',
    'uri',

    'config',
    'helpers',

    // Layout...

    'App',

    // components...
    'bem-components-common',
    'Ctls',

  ],
});
